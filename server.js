var fs = require("fs");
var Nightmare = require("nightmare");
require("nightmare-download-manager")(Nightmare);
var mongoose = require("mongoose");
var models = require("./schemas/record.js");
var _ = require("lodash");
require("dotenv").config();

/**
 * getUpdated calls for web automation tool to download the latest csv file.
 */
let config = JSON.parse(fs.readFileSync('config.json'));

const filepath = process.env.mined_file_path; // for python
console.log("filepath"+filepath);

parseJSON = async () => {
  var data = JSON.parse(fs.readFileSync("./database/record/modified/modified.json"));
  return data;
};


fetch = async (MAXTRIES) => {

  if (MAXTRIES===0){
    console.log("Maximum Retries reached");
    return false;
  };
  
  if(fs.existsSync(filepath)){
    fs.unlink(filepath, function (err) {
      if (err) throw err;
      // if no error, file has been deleted successfully
      console.log('[Removal of previous hts.usitc file] File deleted!');
  }); 
};

mongoose.connection.db.dropDatabase();
// Nightmare default characteristics for timeout, this depends on the amount of data as well as hardware.
let nightmare = Nightmare({ show: false,gotoTimeout:config["gotoTimeout"],waitTimeout:config["waitTimeout"],downloadTimeout:["downloadTimeout"] });
let spawn = require("child_process").spawn;// Spawn is for python script for data preprocessing

console.log("[0] Nightmare is running... \n[0.1] Mining hts.usitc.gov ...");
nightmare.on("download", function(state, downloadItem) {
  if (state == "started") {
    nightmare.emit("download", filepath, downloadItem);
  }
});

    try{
      console.log("Nightmare tries left: " + MAXTRIES);
      await nightmare
  .downloadManager()
  .goto("https://hts.usitc.gov/export")
  .wait(1000)
  .type("body", "\u000d") // press enter
  .type(`input[name="from"]`, "0000")
  .type(`input[name="to"]`, "9999")
  .click("input#Submit.btn.btn-primary")
  .wait(10000)
  .waitDownloadsComplete() // Wait timeout
  .end(() => "some value")
  .then(async () => {
    // now run python script
    console.log("[1] Successfully mined hts.usitc.gov/export");
    console.log("[1.1] Starting child process, running Python script...");
    await new Promise(function(resolve, reject) {
      setTimeout(()=>reject(new Error("Python Process timeout")),500*1000);
      var pythonProcess = spawn("python3", ["./focus.py", filepath]);
      pythonProcess.stdout.on("data", async data => {
        console.log(String(data));
        converted = await parseJSON();
        models.Record.collection.insertMany(
          converted,
          { safe: true },
          function(err, docs) {
            if (err) {
              return console.error(err);
            } else {
              console.log(
                "[4] MongoDB database updated, " +
                  docs.insertedCount +
                  " documents inserted to Collection ..."
              );
            }
          }
        );
        console.log(
          "[3] Successfully handled Python Record Manipulation ..."
        );
        resolve(true);
      });
    });
  });
    return true;

    }catch(e){
      console.log(e.name + ':' + e.message);
      console.log("Error encountered... retrying");
      await this.fetch(MAXTRIES -1);
    }
  
};

runWithoutNightmare = async () => {
  mongoose.connection.db.dropDatabase();
  let spawn = require("child_process").spawn;
  res = await new Promise(function(resolve, reject) {
    var pythonProcess = spawn("python3", ["./focus.py", filepath]);
    pythonProcess.stdout.on("data", async data => {
      console.log(String(data));
      converted = await parseJSON();
      models.Record.collection.insertMany(converted, { safe: true }, function(
        err,
        docs
      ) {
        if (err) {
          return console.error(err);
        } else {
          console.log(
            "[4] MongoDB database updated, " +
              docs.insertedCount +
              " documents inserted to Collection ..."
          );
        }
      });
      console.log("[3] Successfully handled Python Record Manipulation ...");
      resolve(true);
    });
  });
  return res;
};

/*
Standard search would return anything that hits the keyword
*/
const search = async query => {
  hit = await models.Record.find({ 12: { $all: query.split(" ") } }, function(
    err,
    res
  ) {
    if (err) console.log(err);
  }).setOptions({ lean: true });
  var parent_list = [];
  var hit_list = [];
  var ancestor_list = [];

  for (i = 0; i < hit.length; i++) {
    hit_list.push(hit[i][9]); // take all the key of the hits
    ancestor_list.push(hit[i][9]);
    ancestor_list = _.union(ancestor_list,hit[i][13]);
    if (hit[i][11] != "") {
      parent_list.push(hit[i][11]);
    }
    if (hit[i][1] == "0") {
      // Parents themselves
      parent_list.push(hit[i][0]);
    }
  }


  
  parents = await models.Record.find(
    { $and: [{ 0: { $in: parent_list } }, { 1: "0" }] },
    function(err, res) {
      if (err) console.log(err);
    }
  ).setOptions({ lean: true });

  return [parents, hit_list, ancestor_list];
};



/*
Search By code
*/
const searchByCode = async query => {
  queryList = []
  queryIndexes = query.split(".");
  queryList.push(query);

  // Remove trailing zeros
  if (queryIndexes.length >1 ){
    for(i=queryIndexes.length-1;i>0;i--){
      if(queryIndexes.slice(i)[0]=='00'){
        queryList.push(queryIndexes.slice(0, i).join('.'));
      }
    }
  }
  
  // Add trailing zeros until max out 4 indents
  if(queryIndexes.length <4){
    tails=query;
    for(i=1;i<=4-(queryIndexes.length);i++){
      tails = tails+(".00");
      queryList.push(tails);
    }
  }
  console.log(queryList);
  hit = await models.Record.find({ 0: {$in:queryList} }, function(
    err,
    res
  ) {
    if (err) console.log(err);
  }).setOptions({ lean: true });
  var parent_list = [];
  var hit_list = [];
  var ancestor_list = [];

  for (i = 0; i < hit.length; i++) {
    hit_list.push(hit[i][9]); // take all the key of the hits
    ancestor_list.push(hit[i][9]);
    ancestor_list = _.union(ancestor_list,hit[i][13]);
    if (hit[i][11] != "") {
      parent_list.push(hit[i][11]);
    }
    if (hit[i][1] == "0") {
      // Parents themselves
      parent_list.push(hit[i][0]);
    }
  }
  
  parents = await models.Record.find(
    { $and: [{ 0: { $in: parent_list } }, { 1: "0" }] },
    function(err, res) {
      if (err) console.log(err);
    }
  ).setOptions({ lean: true });

  return [parents, hit_list,ancestor_list];
};

module.exports.fetch = fetch;
module.exports.search = search;
module.exports.searchByCode = searchByCode;
module.exports.runWithoutNightmare = runWithoutNightmare;

// Nightmare for data mining automation
const Nightmare = require("nightmare");
require("nightmare-download-manager")(Nightmare);
const nightmare = Nightmare({ show: true });
const fs = require('fs');

// Spawn is for python script for data preprocessing
const spawn = require("child_process").spawn;
const csvtojson = require("csvtojson");

// MongoDB requirements and variables.
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var serverAdr = 'localhost:27017',dbName = 'hts'
mongoose.connect(`mongodb://${serverAdr}/${dbName}`, { useNewUrlParser: true })
mongoose.connection.on('error', function (err) {
    if (err) throw err;
});
mongoose.set('useCreateIndex', true);

const htsSchema = new mongoose.Schema({
  0: String,
  1:String,
  2: String,
  3:String,
  4: String,
  5:String,
  6: String,
  7:String,
  8: String,
  9:[{
    type: String
  }]
});
// Schema object
const Record = mongoose.model('hts_codes', htsSchema);

var example = {
  '0': '0105.94.00.00',
  '1': '2',
  '2': 'Raven',
  '3': '["No.","kg"]',
  '4': '2¢/kg',
  '5': 'Free (A+,AU,BH, CA,CL,CO,D,E,IL,JO,KR,MA,MX, OM,P,PA,PE,SG)',
  '6': '17.6¢/kg',
  '7': '',
  '8': '',
  '9': "['Raven']",
}
let record = new Record(example);

/**
 * getUpdated calls for web automation tool to download the latest csv file.
 */
const filepath= "./database/csv/mined/file.csv"

convertCSV = async() => {
  data = await csvtojson().fromFile("./database/csv/modified/modified.csv")
  return data;
};

parseJSON =  async() => {
  data = await fs.readFileSync('./database/csv/modified/modified.json', 'utf8')
  // out = JSON.parse("["+data.toString().substring(1,data.toString().length-1)+"]");
  // console.log(out)
  // const data = await JSON.parse(fs.readFileSync('./database/csv/modified/modified.json', 'utf8'));
  return JSON.parse(data);
}
const fetch = async() =>{
  console.log("[0] Nightmare is running... \n[0.1] Mining hts.usitc.gov ...")
    nightmare.on("download", function(state, downloadItem) {
        if (state == "started") {
          nightmare.emit("download", filepath, downloadItem);
        }
      });
      
      nightmare
        .downloadManager()
        .goto("https://hts.usitc.gov/export")
        .wait(1000)
        .type("body", "\u000d") // press enter
        .type(`input[name="from"]`, "0000")
        .type(`input[name="to"]`, "9999")
        .click("input#Submit.btn.btn-primary")
        .wait(10000)
        .waitDownloadsComplete()
        .then(() => {
             // now run python script
             console.log("[1] Successfully mined hts.usitc.gov/export")
             const pythonProcess = spawn('python3',["./focus.py", filepath]);
            pythonProcess.stdout.on('data', async(data) => {
            console.log(String(data));
            // converted = await JSON.parse(convertCSV());
            converted = await parseJSON();
            Record.collection.insertMany(converted, function (err, docs) {
              if (err){ 
                  return console.error(err);
              } else {
                console.log(docs.insertedCount+" documents inserted to Collection");
              }
            });
            console.log("[3] Successfully convert .csv to JSON");
            });
           });
    return true
  }

module.exports.fetch = fetch;
/*
Usage
const server = require('./server');
console.log(`User: ${server.fetch()}`);
*/ 


// fetch()

// 
// regex()=> {

// }



// const query = Record.find(); // 'query is an instance of 'query'
// query.setOptions({
//   lean:true, //lean is great for high performance, read only cases.
// }); // 

// query.findOne({'des'})



converted =  parseJSON();
Record.collection.insertMany(converted, function (err, docs) {
  if (err){ 
      return console.error(err);
  } else {
    console.log(docs.insertedCount+" documents inserted to Collection");
  }
});



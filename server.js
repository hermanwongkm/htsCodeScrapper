// Nightmare for data mining automation
const Nightmare = require("nightmare");
require("nightmare-download-manager")(Nightmare);
const nightmare = Nightmare({ show: true });
const fs = require("fs");

// Spawn is for python script for data preprocessing
const spawn = require("child_process").spawn;

// MongoDB requirements and variables.
var mongoose = require("mongoose");
var models = require("./schemas/record.js"); //import records.js

/**
 * getUpdated calls for web automation tool to download the latest csv file.
 */
const filepath = "./database/record/mined/file.csv"; // for python

parseJSON = async () => {
  var data = await require("./database/record/modified/modified.json");
  return data;
};
const fetch = async () => {
  console.log("[0] Nightmare is running... \n[0.1] Mining hts.usitc.gov ...");
  nightmare.on("download", function(state, downloadItem) {
    if (state == "started") {
      nightmare.emit("download", filepath, downloadItem);
    }
  });

  y = await nightmare
    .downloadManager()
    .goto("https://hts.usitc.gov/export")
    .wait(1000)
    .type("body", "\u000d") // press enter
    .type(`input[name="from"]`, "0000")
    .type(`input[name="to"]`, "9999")
    .click("input#Submit.btn.btn-primary")
    .wait(10000)
    .waitDownloadsComplete()
    .then(async () => {
      // now run python script
      console.log("[1] Successfully mined hts.usitc.gov/export");
      console.log("[1.1] Starting child process, running Python script...");
      x = await new Promise(function(resolve, reject) {
        const pythonProcess = spawn("python3", ["./focus.py", filepath]);
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
      return x;
    });
  return y;
};

const search = async query => {
  return await models.Record.find({ 9: `${query}` }).setOptions({ lean: true });
};

module.exports.fetch = fetch;
module.exports.search = search;

// fetch();

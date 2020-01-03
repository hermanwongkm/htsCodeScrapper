fetch = async (MAXTRIES) => {
    if(fs.existsSync(filepath)){
      fs.unlink(filepath, function (err) {
        if (err) throw err;
        // if no error, file has been deleted successfully
        console.log('[Removal of previous hts.usitc file] File deleted!');
    }); 
  };
  
  mongoose.connection.db.dropDatabase();
  // Spawn is for python script for data preprocessing
  let nightmare = Nightmare({ show: false,waitTimeout:1000 });
  let spawn = require("child_process").spawn;
  
  console.log("[0] Nightmare is running... \n[0.1] Mining hts.usitc.gov ...");
  nightmare.on("download", function(state, downloadItem) {
    if (state == "started") {
      nightmare.emit("download", filepath, downloadItem);
    }
  });
  if (MAXTRIES===0){
    console.log("Maximum Retries reached")
    return {failure}
  }
  triesRemaining = MAXTRIES;
  
    
    do{
      try{
        console.log("main loop "+triesRemaining);
        let res = await nightmare
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
      res = await new Promise(function(resolve, reject) {
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
      console.log(res);
    });
        
      }catch{
        keepTrying = true;
        console.log("Error encountered... retrying")
        await this.fetch(MAXTRIES -1);
      }
    }
  };
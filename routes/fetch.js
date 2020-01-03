var express = require("express");
var { fetch, runWithoutNightmare } = require("../server.js");
var router = express.Router();
var fs = require("fs");
let config = JSON.parse(fs.readFileSync('config.json'));

router.get("/getLatest", async function(req, res) {
  res.setTimeout(0, function() {
    console.log("Request has timed out.");
    res.send(400);
  });
  result = await fetch(config["number_retries"]);
  console.log("Fetching Completed");
  console.log(result);
  res.send(result);
});

router.get("/getLocal", async function(req, res) {
  result = await runWithoutNightmare();
  console.log("Running Without Nightmare...");
  console.log(result);
  res.send(result);
});

module.exports = router;

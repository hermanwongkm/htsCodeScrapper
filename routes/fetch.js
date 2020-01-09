var fs = require("fs");
var express = require("express");

var router = express.Router();
var {
  fetch,
  runWithoutNightmare,
  getLastUpdatedTimestamp
} = require("../server.js");
let config = JSON.parse(fs.readFileSync("config.json"));

router.get("/getLatest", async function(req, res) {
  var io = req.app.get("socketio");
  res.send(true);
  result = await fetch(config["number_retries"], io);
  console.log("Fetching Completed");
  console.log(result);
  io.sockets.emit("processed", result);
});

router.get("/getLocal", async function(req, res) {
  result = await runWithoutNightmare();
  console.log("Running Without Nightmare...");
  console.log(result);
  res.send(result);
});

router.get("/getLastUpdate", async function(req, res) {
  result = await getLastUpdatedTimestamp();
  res.send(result);
});

module.exports = router;

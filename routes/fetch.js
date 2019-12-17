var express = require("express");
var { fetch } = require("../server.js");
var router = express.Router();

router.get("/", async function(req, res) {
  result = await fetch();
  console.log("Fetching Completed");
  console.log(result);
  res.send(result);
});

module.exports = router;

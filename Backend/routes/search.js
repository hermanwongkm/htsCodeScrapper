var express = require("express");
var { search } = require("../server.js");
var router = express.Router();

router.get("/:search", async function(req, res) {
  console.log("Entered into search route");
  query = req.params.search;
  console.log(query);
  //Method to query database
  data = await search(query);
  console.log(data);
  res.send(data);
});

module.exports = router;

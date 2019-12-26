var express = require("express");
var { search,searchByCode } = require("../server.js");
var router = express.Router();

router.get("/:search", async function(req, res) {
  query = req.params.search;
  console.log(query);
  //Method to query database
  data = await search(query);
  res.send(data);
});

router.get("/searchc/:searchc", async function(req, res) {
  query = req.params.searchc;
  //Method to query database
  data = await searchByCode(query);
  res.send(data);
});

module.exports = router;

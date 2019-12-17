var express = require("express");
var { search } = require("../server.js");
var router = express.Router();

router.get("/:search", async function(req, res) {
  query = req.params.search;
  console.log(query);
  //Method to query database
  data = await search(query);
  res.send(data);
});

module.exports = router;

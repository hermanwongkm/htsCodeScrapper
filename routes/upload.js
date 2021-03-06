var express = require("express");
var router = express.Router();
require("dotenv").config();

//For uploading file
var multer = require("multer");
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, process.env.mined_file_directory);
  },
  filename: function(req, file, cb) {
    cb(null, "file.csv");
  }
});
var upload = multer({ storage: storage });

router.post("/", upload.single("csvFile"), (req, res) => {
  console.log("Uploading file");
  try {
    res.send(req.file);
  } catch (err) {
    res.send(400);
  }
});

module.exports = router;

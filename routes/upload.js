var express = require("express");
var router = express.Router();
var fs = require("fs");
var filepath = "./database/record/mined/file.csv";
// if(fs.existsSync(filepath)){
//   fs.unlink(filepath, function (err) {
//     if (err) throw err;
//     // if no error, file has been deleted successfully
//     console.log('[Removal of file] File deleted!');
// }); 
// };
//For uploading file
var multer = require("multer");
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./database/record/mined");
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

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const htsSchema = new mongoose.Schema({
  0: String,
  1:String,
  2: String,
  3:String,
  4: String,
  5:String,
  6: String,
  7:String,
  8: String,
  9:[{
    type: String
  }]
});

const Record = mongoose.model('hts_codes', htsSchema);
exports.Record = Record;



var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const htsSchema = new Schema({
  0: String, // HTS_codes
  1: String, // Indent
  2: String, // Description
  3: String,
  4: String,
  5: String,
  6: String,
  7: String,
  8: String,
  9: String,
  10: String,
  11: String,
  12: String
});

const Record = mongoose.model("hts_codes", htsSchema);
exports.Record = Record;

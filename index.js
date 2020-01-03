var mongoose = require("mongoose");
const express = require("express");
var cors = require("cors");
var fs = require("fs");
search = require("./routes/search.js");
fetch = require("./routes/fetch.js");
upload = require("./routes/upload.js");
require("dotenv").config();
var app = express();

//Moongoose Connection
mongoose.Promise = global.Promise;

var server_adr =process.env.server_adr;
var db_name = process.env.db_name;
var express_port = process.env.express_port;

mongoose.connect(`mongodb://${server_adr}/${db_name}`, { useNewUrlParser: true });
mongoose.connection.on("error", function(err) {
  if (err) throw err;
});
mongoose.set("useCreateIndex", true);
console.log("[0.0] Moongose have been connected", server_adr," Collection:",db_name);

//Express Connection

app.listen(express_port, () =>
  console.log("[0.0.1] The upload server is currently listening on: " + express_port)
);
app.use(cors());

app.use("/search", search);
app.use("/fetch", fetch);
app.use("/upload", upload);

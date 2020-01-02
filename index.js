var mongoose = require("mongoose");
const express = require("express");
var cors = require("cors");
var fs = require("fs");
search = require("./routes/search.js");
fetch = require("./routes/fetch.js");
upload = require("./routes/upload.js");

var app = express();
let config = JSON.parse(fs.readFileSync('config.json'));

//Moongoose Connection
mongoose.Promise = global.Promise;


mongoose.connect(`mongodb://${config["server_adr"]}/${config["db_name"]}`, { useNewUrlParser: true });
mongoose.connection.on("error", function(err) {
  if (err) throw err;
});
mongoose.set("useCreateIndex", true);
console.log("[0.0] Moongose have been connected", config["server_adr"]," Collection:",config["db_name"]);

//Express Connection
const port = config["express_port"];
app.listen(port, () =>
  console.log("[0.0.1] The upload server is currently listening on: " + port)
);
app.use(cors());

app.use("/search", search);
app.use("/fetch", fetch);
app.use("/upload", upload);

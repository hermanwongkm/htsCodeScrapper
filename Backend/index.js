var mongoose = require("mongoose");
const express = require("express");
var cors = require("cors");

search = require("./routes/search.js");
var { fetch } = require("./server.js");

var app = express();

//Moongoose Connection
mongoose.Promise = global.Promise;

var serverAdr = "localhost:27017",
  dbName = "hts";

mongoose.connect(`mongodb://${serverAdr}/${dbName}`, { useNewUrlParser: true });
mongoose.connection.on("error", function(err) {
  if (err) throw err;
});
mongoose.set("useCreateIndex", true);
console.log("[0.0]moongose have been connected");

//Express Connection
const port = 3001;
app.listen(port, () =>
  console.log("The server is currently listening on: " + port)
);
app.use(cors());
app.use("/search", search);

// fetch();

var cors = require("cors");
const http = require("http");
var mongoose = require("mongoose");
const express = require("express");
const socketIO = require("socket.io");

require("dotenv").config();
fetch = require("./routes/fetch.js");
upload = require("./routes/upload.js");
search = require("./routes/search.js");

var app = express();
const server = http.createServer(app);

//Moongoose Connection
mongoose.Promise = global.Promise;

var server_adr = process.env.server_adr;
var db_name = process.env.db_name;
var express_port = process.env.express_port;

mongoose.connect(`mongodb://${server_adr}/${db_name}`, {
  useNewUrlParser: true
});
mongoose.connection.on("error", function(err) {
  if (err) throw err;
});
mongoose.set("useCreateIndex", true);
console.log(
  "[0.0] Moongose have been connected",
  server_adr,
  " Collection:",
  db_name
);

var io = socketIO(server);

server.listen(express_port, () =>
  console.log(
    "[0.0.1] The upload server is currently listening on: " + express_port
  )
);

io.on("connection", socket => {
  console.log("User connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.use(cors());

app.use(function(req, res, next) {
  req.io = io;
  next();
});

app.use("/search", search);
app.use("/fetch", fetch);
app.use("/upload", upload);

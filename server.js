const express = require("express");
const bodyParser = require("body-parser");
const inscriptionController = require("./controllers/inscriptionController");
const app = express();

const urlencondingParser = bodyParser.urlencoded({ extended: false }); //middleware
app.use(express.static(__dirname + "/css")); //link to css file
app.set("view engine", "ejs"); //use ejs

var TYPES = require("tedious").TYPES;
var Connection = require("tedious").Connection;
var Request = require("tedious").Request;

// Create connection to database
var config = {
  userName: "laetitia",
  password: "", // update me
  server: "inscri-sports.database.windows.net",
  options: {
    database: "inscri-sports",
    encrypt: true
  }
};

//fire controllers
inscriptionController(app, Connection, config, TYPES, Request);

app.get("/", (req, res) => {
  res.render("pages/index.ejs");
});

app.get("/connection", (req, res) => {
  res.render("pages/connection.ejs");
});

app.get("/sports", (req, res) => {
  res.render("pages/sports.ejs");
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log("Listening on port " + port));

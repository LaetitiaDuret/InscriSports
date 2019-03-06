const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");

//Controllers
const inscriptionController = require("./controllers/inscriptionController");
const homeController = require("./controllers/homeController");
const sportsController = require("./controllers/sportsController");

const app = express();
//const router = express.Router();

// use session middleware
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
  })
);

const urlencondingParser = bodyParser.urlencoded({ extended: false }); //middleware
app.use(express.static(__dirname + "/css")); //link to css file
app.set("view engine", "ejs"); //use ejs
//router.use(bodyParser.json());

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
homeController(app, Connection, config, TYPES, Request);
sportsController(app, Connection, config, TYPES, Request);

app.get("/", (req, res) => {
  res.render("pages/index.ejs");
});

app.get("/connection", (req, res) => {
  res.render("pages/connection.ejs");
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log("Listening on port " + port));

const express = require("express");

const app = express();

app.use(express.static(__dirname + '/css'));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("pages/index.ejs")
}
);

app.get("/connection", (req, res) => {
    res.render("pages/connection.ejs")
}
);

app.get("/sports", (req, res) => {
    res.render("pages/sports.ejs")
}
);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log("Listening on port " + port));



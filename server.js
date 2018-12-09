const express = require("express");

const app = express();

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("pages/index.ejs")
}
);

app.get("/about", (req, res) => {
    res.render("pages/about.ejs")
}
);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log("Listening on port " + port));



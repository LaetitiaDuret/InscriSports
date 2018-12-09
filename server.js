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

app.listen(3000, () => console.log("Listening on port 3000"));



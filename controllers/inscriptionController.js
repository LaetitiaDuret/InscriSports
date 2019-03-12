const bodyParser = require("body-parser");
const urlencondingParser = bodyParser.urlencoded({ extended: false }); //middleware

module.exports = function(app, Connection, config, TYPES, Request) {
  app.get("/inscription", (req, res) => {
    res.render("pages/inscription.ejs");
  });

  app.post("/inscription", urlencondingParser, (req, res) => {
    var connection = new Connection(config);

    // Attempt to connect and execute queries if connection goes through
    connection.on("connect", mycallback);

    function mycallback(err) {
      if (err) {
        console.log(err);
      } else {
        queryDatabase();
      }
    }

    function queryDatabase() {
      console.log("Reading rows from the Table...");

      // Read all rows from table
      var request = new Request(
        "INSERT INTO Student (password, firstname, lastname, email) VALUES (@password,@name,@lastname, @email) ; SELECT @@identity",
        function(err, rowCount, rows) {
          console.log(err);
          console.log(rowCount + " row(s) returned");
          //process.exit();
        }
      );
      var ident;

      const { body } = req;
      //request.addParameter("id", TYPES.Int, 0);
      request.addParameter("password", TYPES.VarChar, body.mdp);
      request.addParameter("name", TYPES.VarChar, body.firstname);
      request.addParameter("lastname", TYPES.VarChar, body.lastname);
      request.addParameter("email", TYPES.VarChar, body.email);

      connection.execSql(request);

      request.on("row", function(columns) {
        if (columns[0].value === null) {
          console.log("NULL");
        } else {
          ident = columns[0].value;
          console.log("Le num étudiant est : " + ident);
          req.session.userData = req.body;
          req.session.userData.id = ident;
          console.log("Le num de session est : " + req.session.userData.id);
          res.redirect("home");
        }
      });
    }
  });
};

const bodyParser = require("body-parser");
const urlencondingParser = bodyParser.urlencoded({ extended: false }); //middleware

module.exports = function(app, Connection, config, TYPES, Request) {
  app.get("/sports/:sportId", (req, res) => {
    var sportId = req.params.sportId;
    var userData = req.session.userData;

    var connection = new Connection(config);

    // Attempt to connect and execute queries if connection goes through
    connection.on("connect", mycallback(userData));

    function mycallback(userData) {
      return function insidecallback(err) {
        if (err) {
          console.log(err);
        } else {
          queryDatabase(userData, sportId);
        }
      };
    }

    function queryDatabase(userData, sportId) {
      console.log("Reading rows from Sport...");
      // Read all rows from table
      var request = new Request(
        "SELECT sport_name, description FROM Sport WHERE id = " + sportId,
        function(err) {
          if (err) {
            console.log(err);
          }
        }
      );

      var sportData = {};
      request.on("row", function(columns) {
        columns.forEach(function(column) {
          if (column.value === null) {
            console.log("NULL");
          } else {
            sportData[column.metadata.colName] = column.value;
          }
        });
      });

      req.session.currentSportData = sportData;

      request.on("doneInProc", function(rowCount, more) {
        console.log(rowCount + " rows returned");
        res.render("pages/sport_details.ejs", { sportData, sportId, userData });
      });

      connection.execSql(request);
    }
  });

  app.post("/sports/:sportId", urlencondingParser, (req, res) => {
    var sportId = req.params.sportId;
    var userData = req.session.userData;
    var studentId = req.session.userData.id;
    console.log("Le num de session est : " + req.session.userData.id);

    var connection = new Connection(config);

    // Attempt to connect and execute queries if connection goes through
    connection.on("connect", mycallback);

    function mycallback(err) {
      if (err) {
        console.log(err);
      } else {
        queryDatabase(userData, sportId, studentId);
      }
    }

    function queryDatabase(userData, sportId, studentId) {
      console.log("Reading rows from Subscription...");

      // Read all rows from table
      var request = new Request(
        "INSERT INTO Subscription (student_id, sport_id) VALUES (@studentId, @sportId)",
        function(err, rowCount, rows) {
          console.log(err);
          console.log(rowCount + " row(s) returned");
          //process.exit();
        }
      );

      //request.addParameter("id", TYPES.Int, 0);
      request.addParameter("studentId", TYPES.Int, studentId);
      request.addParameter("sportId", TYPES.Int, sportId);

      request.on("doneInProc", function(rowCount, more) {
        console.log(rowCount + " rows returned after subscription");
        var sportData = req.session.currentSportData;
        res.render("pages/sport_details.ejs", { sportData, sportId, userData });
      });

      connection.execSql(request);
    }
  });
};

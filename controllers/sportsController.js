module.exports = function(app, Connection, config, TYPES, Request) {
  app.get("/sports/:sportId", (req, res) => {
    var sportId = req.params.sportId;
    console.log("l'id du sport de l'URL est : " + sportId);
    //res.render("pages/sports.ejs");
    var connection = new Connection(config);
    // console.log(req.body);
    // Attempt to connect and execute queries if connection goes through
    connection.on("connect", mycallback(req.body));

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
      console.log("sport ID dans query est : " + sportId);
      var request = new Request(
        "SELECT sport_name, description FROM Sport WHERE id = " + sportId,
        function(err) {
          if (err) {
            console.log(err);
          }
        }
      );

      var sportDescription = {};
      request.on("row", function(columns) {
        //console.log("la colonne : " + columns);
        columns.forEach(function(column) {
          console.log("la colonne : " + column.metadata.colName);
          if (column.value === null) {
            console.log("NULL");
          } else {
            sportDescription[column.metadata.colName] = column.value;
          }
        });
      });

      request.on("doneInProc", function(rowCount, more) {
        console.log(rowCount + " rows returned");
        //console.log("sport description : " + sportDescription.description);
        userData = req.session.userData;
        res.render("pages/sport_details.ejs", { sportDescription, userData });
      });

      connection.execSql(request);
    }
  });
};

module.exports = function(app, Connection, config, TYPES, Request) {
  app.get("/home", (req, res) => {
    var connection = new Connection(config);
    // Attempt to connect and execute queries if connection goes through
    connection.on("connect", mycallback(req.session.userData));

    function mycallback(userData) {
      return function insidecallback(err) {
        if (err) {
          console.log(err);
        } else {
          queryDatabase(userData);
        }
      };
    }

    function queryDatabase(userData) {
      console.log("Reading rows from Sport...");
      // Read all rows from table
      var request = new Request("SELECT id, sport_name FROM Sport", function(
        err
      ) {
        if (err) {
          console.log(err);
        }
      });

      var sportsList = [];
      request.on("row", function(columns) {
        var sport = {};
        columns.forEach(function(column) {
          //console.log("la colonne : " + column.metadata.colName);
          if (column.value === null) {
            console.log("NULL");
          } else {
            sport[column.metadata.colName] = column.value;
          }
        });
        sportsList.push(sport);
      });

      request.on("doneInProc", function(rowCount, more) {
        console.log(rowCount + " rows returned");
        console.log(sportsList);
        //userData = req.session.userData;
        res.render("pages/home.ejs", { sportsList, userData });
      });

      connection.execSql(request);
    }
  });
};

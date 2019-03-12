module.exports = function(app, Connection, config, TYPES, Request) {
  app.get("/subscriptions", (req, res) => {
    var connection = new Connection(config);
    //var userData = req.session.userData;
    console.log("userData id est : " + req.session.userData.id);
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
      var request = new Request(
        "SELECT Sport.id, sport_name FROM Sport JOIN Subscription ON sport_id = Sport.id " +
          "WHERE student_id = @id",
        function(err) {
          if (err) {
            console.log(err);
          }
        }
      );
      request.addParameter("id", TYPES.VarChar, req.session.userData.id);

      var subscriptionsList = [];
      request.on("row", function(columns) {
        //console.log("la colonne : " + columns);
        var sport = {};
        columns.forEach(function(column) {
          console.log("la colonne : " + column.metadata.colName);
          if (column.value === null) {
            console.log("NULL");
          } else {
            sport[column.metadata.colName] = column.value;
          }
        });
        subscriptionsList.push(sport);
      });

      request.on("doneInProc", function(rowCount, more) {
        console.log(rowCount + " rows returned");
        console.log(subscriptionsList);
        var seancesList = null;
        res.render("pages/subscriptions.ejs", {
          subscriptionsList,
          userData,
          seancesList
        });
      });

      connection.execSql(request);
    }
  });

  app.get("/subscription/:sportId", (req, res) => {
    var sportId = req.params.sportId;

    var connection = new Connection(config);

    // Attempt to connect and execute queries if connection goes through
    connection.on("connect", mycallback(req.session.userData));

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
      console.log("Reading rows from Seance...");
      // Read all rows from table
      var request = new Request(
        "SELECT description, seance_date FROM Seance WHERE sport_id = " +
          sportId,
        function(err) {
          if (err) {
            console.log(err);
          }
        }
      );

      var seancesList = [];
      request.on("row", function(columns) {
        var seance = {};
        columns.forEach(function(column) {
          //console.log("la colonne : " + column.metadata.colName);
          if (column.value === null) {
            console.log("NULL");
          } else {
            seance[column.metadata.colName] = column.value;
          }
        });
        seancesList.push(seance);
      });

      request.on("doneInProc", function(rowCount, more) {
        console.log(rowCount + " rows returned");
        userData = req.session.userData;
        var subscriptionsList = null;
        res.render("pages/subscriptions.ejs", {
          seancesList,
          userData,
          sportId,
          subscriptionsList
        });
      });

      connection.execSql(request);
    }
  });
};

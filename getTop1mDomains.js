var request = require("request");
var unzip = require("unzip");
var csv2 = require("csv2");
var { testWithPa11y } = require("./utils.js");
var sqlite3 = require("sqlite3");
var { open } = require("sqlite");

// this is a top-level await
(async () => {
  sqlite3.verbose();
  // open the database
  const db = await open({
    filename: "./sites.db",
    driver: sqlite3.Database,
  });

  // create the table
  await db.run(`
    CREATE TABLE IF NOT EXISTS urls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT NOT NULL
      );
    `);

  request
    .get("http://s3.amazonaws.com/alexa-static/top-1m.csv.zip")
    .pipe(unzip.Parse())
    .on("entry", function (entry) {
      entry.pipe(csv2()).on("data", (data) => {
        // console.log(data);
        db.run(`INSERT INTO urls (url) VALUES (?)`, [data[1]]);
      });
    });
})();

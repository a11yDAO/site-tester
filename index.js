var request = require("request");
var unzip = require("unzip");
var csv2 = require("csv2");
var { testWithPa11y } = require("./utils.js");

// testWithPa11y("https://google.com");

request
  .get("http://s3.amazonaws.com/alexa-static/top-1m.csv.zip")
  .pipe(unzip.Parse())
  .on("entry", function (entry) {
    console.log("entry");
    entry.pipe(csv2()).on("data", (data) => {
      console.log("data", data);
    });
  });

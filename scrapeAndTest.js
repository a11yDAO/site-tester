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
    CREATE TABLE IF NOT EXISTS results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      domain TEXT NOT NULL,
      results TEXT NOT NULL
      );
    `);

  // loop over the urls table and test each with pa11y
  const domains = await db.all("SELECT id, url FROM urls");
  for (let i = 0; i < domains.length; i++) {
    const domain = domains[i];
    const results = await testWithPa11y(domain.url);
    // insert results
    await db.run("INSERT INTO results (domain, results) VALUES (?, ?)", [
      domain.url,
      JSON.stringify(results),
    ]);
  }
})();

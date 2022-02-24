import { testWithPa11y } from "./utils.js";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import pLimit from 'p-limit'

// this is a top-level await
(async () => {
  const MAX_CONCURRENT = 25
  const limit = pLimit(MAX_CONCURRENT)

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

  let running = 0

  // loop over the urls table and test each with pa11y
  const domains = await db.all("SELECT id, url FROM urls");

  let promises = domains.map(domain => {
    // wrap the function we are calling in the limit function we defined above
    return limit(() => testWithPa11y({url: domain.url, db}));
  });

  await Promise.all(promises);

  // for (let i = 0; i < domains.length; i++) {
  //   const domain = domains[i];
  //   console.log(`scraping ${domain.url} which is ${i + 1} of ${domains.length}`)
  //   running++
  //   await new Promise(async (resolve) => {
  //     running++
  //     if(running > MAX_CONCURRENT){
  //       await testWithPa11y({url: domain.url, db});
  //       running--
  //     } else {
  //       testWithPa11y({url: domain.url, db});
  //     }
  //     resolve();
  //   });
  // }
})();

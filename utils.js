import pa11y from "pa11y";

export async function testWithPa11y({ url, db }) {
  console.log(`Scraping ${url}`);
  try {
    const results = await pa11y(url);
  } catch (e) {
    console.log("pa11y error.  swallowing", e);
  }
  // insert results
  await db.run("INSERT INTO results (domain, results) VALUES (?, ?)", [
    url,
    JSON.stringify(results),
  ]);
}

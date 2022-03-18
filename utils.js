import pa11y from "pa11y";

export async function testWithPa11y({url, db}) {
  console.log(`Scraping ${url}`)
	let results
  try {
    const results = await pa11y(url);
  } catch (e) {
    console.log("pa11y error.  swallowing", e);
  }
	if (!results){
		return
	}
  // insert results
  await db.run("INSERT INTO results (domain, results) VALUES (?, ?)", [
    url,
    JSON.stringify(results),
  ]);
	console.log(`committed ${url}`);
}

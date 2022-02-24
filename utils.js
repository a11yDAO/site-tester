const pa11y = require("pa11y");

async function testWithPa11y(url) {
  const results = await pa11y(url);
  return results;
}

module.exports = { testWithPa11y };

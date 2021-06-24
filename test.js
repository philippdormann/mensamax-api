const { fetcher } = require('./api/fetcher');
const { parser } = require('./api/parser');
const fs = require('fs');
(async function () {
    const out = await fetcher({ p: "FO111", e: "herz" })
    fs.writeFileSync("./fetched.html", out)
    const json = await parser(out)
    fs.writeFileSync("./parsed.json", JSON.stringify(json))
})()
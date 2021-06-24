const { fetcher } = require('./api/fetcher');
const fs = require('fs');
(async function () {
    const out = await fetcher({ p: "FO111", e: "herz" })
    fs.writeFileSync("./fetched.html", out)
})()
const cheerio = require('cheerio');
const fs = require('fs');
const minify = require('html-minifier').minify;
const input = fs.readFileSync("./out.html", { encoding: "utf-8" })

let tmp = cheerio.load(input)
tmp("*").removeAttr("style").removeAttr("class").removeAttr("valign").removeAttr("colspan").removeAttr("align").removeAttr("border").removeAttr("cellpadding").removeAttr("alt").removeAttr("title").removeAttr("onclick")
tmp("img").parent().remove()
tmp("input").remove()
tmp("script").remove()
tmp("#strDetails").parent().parent().remove()
tmp("td").removeAttr("id")
tmp("tr").removeAttr("id")
tmp = tmp.html()
tmp = tmp.replaceAll("<td>•&nbsp;</td>", "")

tmp = minify(tmp, {
    useShortDoctype: true,
    minifyCSS: true,
    collapseWhitespace: true
});

tmp = tmp.replaceAll("</td><td><table><tbody><tr></tr><tr><td><table><tbody><tr><td></td></tr><tr><td><div>", "</category><day><food>")
tmp = tmp.replaceAll("</div></td></tr></tbody></table></td></tr></tbody></table></category><day><food>", "</food></day><day><food>")
tmp = tmp.replaceAll("</div></td></tr></tbody></table></td></tr></tbody></table></td></tr><tr><td>", "</food></day><category>")
tmp = tmp.replaceAll("</div></td></tr><tr><td><div>", "</food><food>")
tmp = tmp.replaceAll("</th></tr><tr><td>", "</th></tr><wrap><category>")
tmp = tmp.replaceAll("<category></td><td></td><td></td><td></td><td></td></tr>", "</wrap>")
tmp = tmp.replaceAll(/<food>\d+ /gi, "<food>")

fs.writeFileSync("./parsed1.html", tmp)

let $ = cheerio.load(input)
let hinweis = $("#lblSpeiesplanHinweis").text();
let he = []
let head = $(".tdHeader th").each((i, e) => {
    he.push($(e).html())
})
let h = he.filter(h => h !== "")
// console.log(h);
// console.log(hinweis);

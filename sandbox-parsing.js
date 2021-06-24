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

let $1 = cheerio.load(tmp)
let categories = []
let elements = []
$1("category").each(function (index, element) {
    categories.push($1(element).text())
});
$1("day").each(function (index, element) {
    let $2 = cheerio.load($1(element).html())
    let items = []
    $2("food").each(function (index, element) {
        let $3 = cheerio.load($2(element).html())
        let zusatzstoffe = []
        $3("span").each(function (index, element) {
            zusatzstoffe.push($3(element).text())
        });
        $3("sub").remove()
        items.push({ title: $3.text(), zusatzstoffe })
    });
    elements.push(items)
});
// console.log({ categories });
// console.log({ elements });

fs.writeFileSync("./dmeo.json", JSON.stringify(elements))

let $ = cheerio.load(input)
let hinweis = $("#lblSpeiesplanHinweis").text();
let he = []
let head = $(".tdHeader th").each((i, e) => {
    he.push($(e).html())
})
let h = he.filter(h => h !== "")
// console.log(h);
// console.log(hinweis);

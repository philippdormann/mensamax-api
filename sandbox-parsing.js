const cheerio = require('cheerio');
const fs = require('fs');
const minify = require('html-minifier').minify;
const input = fs.readFileSync("./out.html", { encoding: "utf-8" })

function chunk(arr, len) {
    let chunks = []
    let i = 0
    let n = arr.length;
    while (i < n) {
        chunks.push(arr.slice(i, i += len));
    }
    return chunks;
}

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
tmp = tmp.replaceAll("</div></td></tr></tbody></table></td></tr></tbody></table></td><td></td><td><table><tbody><tr><td><table><tbody><tr><td></td></tr><tr><td><div>", "</day><day></day>")
tmp = tmp.replaceAll("</div></td></tr></tbody></table></td></tr></tbody></table></td><td><table><tbody><tr><td><table><tbody><tr><td></td></tr><tr><td><div>", "</food></day><day><food>")
tmp = tmp.replaceAll("</td><td><table><tbody><tr><td><table><tbody><tr><td></td></tr><tr><td><div>", "</category><day><food>")
tmp = tmp.replaceAll("</wrap></tbody></table></td></tr><tr><td>", "</wrap>")
tmp = tmp.replaceAll("</div></td></tr></tbody></table></td></tr></tbody></table></td><td></td></tr><tr><td>", "</food></day><day></day>")
tmp = tmp.replaceAll(/<food>\d+ /gi, "<food>")

// fs.writeFileSync("./parsed1.html", tmp)

const $1 = cheerio.load(tmp)
let categories = []
let elements = []
$1("category").each(function (index, element) {
    categories.push($1(element).text())
});
$1("day").each(function (index, element) {
    const $2 = cheerio.load($1(element).html())
    let items = []
    $2("food").each(function (index, element) {
        const $3 = cheerio.load($2(element).html())
        let zusatzstoffe = []
        $3("span").each(function (index, element) {
            zusatzstoffe.push($3(element).text())
        });
        $3("sub").remove()
        items.push({ title: $3.text(), zusatzstoffe })
    });
    elements.push(items)
});
const $ = cheerio.load(input)
const hinweis = $("#lblSpeiesplanHinweis").text();
let he = []
$(".tdHeader th").each((i, e) => {
    he.push($(e).html())
})
let days = he.filter(h => h !== "")

elements = chunk(elements, days.length)
fs.writeFileSync("./dmeo.json", JSON.stringify(elements))
// 
let out = {};
// 
// console.log(categories);
let index = 0;
categories.forEach(c => {
    let i = 0;
    days.forEach(d => {
        // console.log(elements[index][i]);
        // out[`${h[index]}`] = {}
        if (!out[`${days[i]}`]) {
            out[`${days[i]}`] = {}
        }
        out[`${days[i]}`][`${categories[index]}`] = elements[index][i]
        i++;
    });
    index++;
});
// console.log(out);
fs.writeFileSync("./result.json", JSON.stringify(out))
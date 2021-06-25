const cheerio = require('cheerio');
var parser = require('fast-xml-parser');
const fs = require('fs');
const minify = require('html-minifier').minify;
function chunk(arr, len) {
	let chunks = [];
	let i = 0;
	let n = arr.length;
	while (i < n) {
		chunks.push(arr.slice(i, (i += len)));
	}
	return chunks;
}
exports.parser = (input) => {
	return new Promise(function (resolve, reject) {
		try {
			let tmp = cheerio.load(input);
			const timeRange = tmp('#lblWoche').text()
			// drop all attributes + unneeded elements for better parsing
			tmp('*')
				.removeAttr('style')
				.removeAttr('class')
				.removeAttr('valign')
				.removeAttr('colspan')
				.removeAttr('align')
				.removeAttr('border')
				.removeAttr('cellpadding')
				.removeAttr('alt')
				.removeAttr('title')
				.removeAttr('onclick');
			tmp('img').parent().remove();
			tmp('input').remove();
			tmp('script').remove();
			tmp('#strDetails').parent().parent().remove();
			tmp('td').removeAttr('id');
			tmp('tr').removeAttr('id');
			tmp = tmp("#tblMain").parent().html()
			tmp = tmp.replaceAll('<td>•&nbsp;</td>', '');
			// minify html for easier parsing
			tmp = minify(tmp, {
				useShortDoctype: true,
				minifyCSS: true,
				collapseWhitespace: true
			});
			// remove empty food items
			tmp = tmp.replaceAll('<tr><td></td></tr>', '');
			tmp = tmp.replaceAll('<td></td><td></td><td></td><td></td><td></td>', '');
			tmp = tmp.replaceAll('</div></td></tr></tbody></table></td></tr></tbody></table></td><td><table><tbody><tr><td><table><tbody><tr><td><div>', '</food></day><day><food>');
			tmp = tmp.replaceAll('<td><table><tbody><tr><td><table><tbody><tr><td><div>', '<day><food>');
			tmp = tmp.replaceAll('</div></td></tr><tr><td><div>', '</food><food>');
			tmp = tmp.replaceAll('</div></td></tr></tbody></table></td></tr></tbody></table></td>', '</food></day>');
			tmp = tmp.replaceAll('</day><td></td><food>', '</day><day></day><day><food>');
			tmp = tmp.replaceAll('<td></td>', '<day></day>');
			tmp = tmp.replaceAll('</tr><tr>', '');
			tmp = tmp.replaceAll('</th><td>', '</tr></th><td>');
			tmp = tmp.replaceAll('</tr></tbody></table>', '</tbody></table>');
			// begin parsing: load html into cheerio object
			let $ = cheerio.load(input);
			const hinweis = $('#lblSpeiesplanHinweis').text();
			let days = [];
			$('.tdHeader th').each((i, e) => {
				days.push($(e).html());
			});
			days = days.filter((h) => h !== '');
			// ==========
			// load preprocessed html into cheerio object
			$ = cheerio.load(tmp)
			// = = = = = = = = = = = = = = = = = = 
			const $1 = cheerio.load(tmp);
			let categories = [];
			let elements = [];
			$1('td').each(function (index, element) {
				categories.push($1(element).text());
			});
			$1('day').each(function (index, element) {
				const $2 = cheerio.load($1(element).html());
				let items = [];
				$2('food').each(function (index, element) {
					const $3 = cheerio.load($2(element).html());
					let zusatzstoffe = [];
					$3('span').each(function (index, element) {
						zusatzstoffe.push($3(element).text());
					});
					$3('sub').remove();
					items.push({ title: $3.text(), zusatzstoffe });
				});
				elements.push(items);
			});
			$ = cheerio.load(input);
			elements = chunk(elements, days.length);
			let out = {};
			let index = 0;
			categories.forEach((c) => {
				let i = 0;
				days.forEach((d) => {
					if (!out[`${days[i]}`]) {
						out[`${days[i]}`] = {};
					}
					out[`${days[i]}`][`${categories[index]}`] = elements[index][i];
					i++;
				});
				index++;
			});
			// = = = = = = = = = = = = = = = = = = 
			fs.writeFileSync("./outdemo.html", tmp)
			fs.writeFileSync("./outdemo.json", JSON.stringify(out))
			resolve({ json: out, html: tmp, hinweis, categories, timeRange, days });
		} catch (e) {
			reject(e);
		}
	})
}
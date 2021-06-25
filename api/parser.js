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
			let out = {}
			let categories = []
			let items = []
			fs.writeFileSync("./outdemo.html", $.html())

			// DEBUG: console.log($("#tblMain > tbody > tr").length);

			// loop through table rows
			$("#tblMain > tbody > tr").each(function (index, element) {
				// exclude days row
				if (index !== 0) {
					const ehtml = $(element).html()
					fs.appendFileSync("outdemo1.html", ehtml + "\n\n")
					$ = cheerio.load(ehtml);
					let row = []
					console.log(ehtml);
					$("td").each(function (index, element) {
						// const ehtml = $(element).parent().html()
						// if (ehtml.includes("<div>")) {
						// 	console.log("it's food");
						// } else {
						// 	console.log("it's a category");
						// }
					});

					// 	$("td table tbody").each(function (index, element) {
					// 		$ = cheerio.load($(element).html());
					// 		let foods = []
					// 		$("div").each(function (index, element) {
					// 			const $3 = cheerio.load($(element).html());
					// 			let z = [];
					// 			$3('span').each((i, e) =>
					// 				z.push($3(e).text())
					// 			);
					// 			$3('sub').remove();
					// 			foods.push({ type: "food", title: $3.text(), z });
					// 		});
					// 		items.push(foods);
					// 	});
					// } else {
					// 	if ($(element).text() !== "") {
					// 		categories.push($(element).text())
					// 		items.push([{ title: $(element).text(), type: "category" }])
					// 	} else {
					// 		items.push({ title: $(element).text(), type: "food", z: [] })
					// 	}
					// }
				}
			});
			// fs.writeFileSync("outdemo.json", JSON.stringify(items))
			// console.log(items);
			resolve(out);
		} catch (e) {
			reject(e);
		}
	})
}
const cheerio = require('cheerio');
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

			tmp = minify(tmp, {
				useShortDoctype: true,
				minifyCSS: true,
				collapseWhitespace: true
			});

			const $ = cheerio.load(input);
			const hinweis = $('#lblSpeiesplanHinweis').text();
			let days = [];
			$('.tdHeader th').each((i, e) => {
				days.push($(e).html());
			});
			days = days.filter((h) => h !== '');
			tmp = tmp.replaceAll(
				'<tr><td></td><td></td><td></td><td></td><td></td></tr>',
				''
			);
			tmp = tmp.replaceAll(
				'<tr><td></td></tr>',
				''
			);
			tmp = tmp.replaceAll(/<div>\d+ /gi, '<div>');

			const $1 = cheerio.load(tmp)
			let categories = []
			let items = []
			$1("td").each(function (index, element) {
				if ($1(element).html().includes("<div>")) {
					const $2 = cheerio.load($1(element).html());
					$2("td table tbody").each(function (index, element) {
						const $5 = cheerio.load($(element).html());
						let foods = []
						$5("div").each(function (index, element) {
							const $3 = cheerio.load($5(element).html());
							let z = [];
							$3('span').each(function (index, element) {
								z.push($3(element).text());
							});
							$3('sub').remove();
							foods.push({ type: "food", title: $3.text(), z });
						});
						items.push(foods);
					});
				} else {
					if ($1(element).text() !== "") {
						categories.push($1(element).text())
						items.push([{ title: $1(element).text(), type: "category" }])
					} else {
						items.push({ title: $1(element).text(), type: "food", z: [] })
					}
				}
			});
			fs.writeFileSync('./elements.json', JSON.stringify(items));
			resolve(items);
		} catch (e) {
			reject(e);
		}
	})
}
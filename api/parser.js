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
			tmp = tmp.html();
			tmp = tmp.replaceAll('<td>•&nbsp;</td>', '');

			tmp = minify(tmp, {
				useShortDoctype: true,
				minifyCSS: true,
				collapseWhitespace: true
			});
			tmp = tmp.replaceAll(
				'<tr><td></td></tr>',
				''
			);
			tmp = tmp.replaceAll(
				'<td><table><tbody><tr><td><table><tbody>',
				'<day>'
			);
			tmp = tmp.replaceAll(
				'</tbody></table></td></tr></tbody></table></td>',
				'</day>'
			);
			tmp = tmp.replaceAll(
				'<tr><td><div>',
				'<food>'
			);
			tmp = tmp.replaceAll(
				'</div></td></tr></day>',
				'</food></day>'
			);
			tmp = tmp.replaceAll(
				'</div></td></tr>',
				'</food>'
			);
			tmp = tmp.replaceAll(
				'</th></tr><tr><td>',
				'</th></tr><wrapper><td>'
			);
			tmp = tmp.replaceAll(
				'</day></tr><tr>',
				'</day>'
			);
			tmp = tmp.replaceAll(
				'<td></td><td></td><td></td><td></td><td></td></tr>',
				'</wrapper>'
			);
			tmp = tmp.replaceAll(
				'</day><td></td></tr><tr>',
				'</day><day></day>'
			);
			tmp = tmp.replaceAll(
				'</day><td></td><day>',
				'</day><day></day><day>'
			);
			tmp = tmp.replaceAll(/<food>\d+ /gi, '<food>');

			fs.writeFileSync('./tmp.html', tmp);

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
			const $ = cheerio.load(input);
			const hinweis = $('#lblSpeiesplanHinweis').text();
			let days = [];
			$('.tdHeader th').each((i, e) => {
				days.push($(e).html());
			});
			days = days.filter((h) => h !== '');
			elements = chunk(elements, days.length);
			console.log(elements);
			let out = {};
			let index = 0;
			categories.forEach((c) => {
				let i = 0;
				days.forEach((d) => {
					if (!out[`${days[i]}`]) {
						out[`${days[i]}`] = {};
					}
					console.log({ index });
					// out[`${days[i]}`][`${categories[index]}`] = elements[index][i];
					i++;
				});
				index++;
			});
			fs.writeFileSync('./elements.json', JSON.stringify(elements));
			resolve(out);
		} catch (e) {
			reject(e);
		}
	})
}
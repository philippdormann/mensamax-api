// ==== polyfill for Vercel Node.js v14
if (!String.prototype.replaceAll) {
	String.prototype.replaceAll = function (str, newStr) {
		if (
			Object.prototype.toString.call(str).toLowerCase() ===
			'[object regexp]'
		) {
			return this.replace(str, newStr);
		}
		return this.replace(new RegExp(str, 'g'), newStr);
	};
}
// ==== polyfill for Vercel Node.js v14
// =====================================
const cheerio = require('cheerio');
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
/**
 * @typedef {Object} MensaplanResponse
 * @property {Object} json parsed json object containing all days as keys and days/ food items as object values
 * @property {string} html human readable html version of mensaplan
 * @property {string} hinweis note of the institution/ kitchen
 * @property {Array} categories array of available categories in the mensaplan
 * @property {string} timerange start and end date of mensaplan along with calendar week if available
 * @property {Array} days array of days in this mensaplan
 * @property {string} days array of days in this mensaplan
 * @property {Array} elements_unchunked unchunked array of food/ day items in this mensaplan
 */
/**
 * @returns {MensaplanResponse} MensaplanResponse
 */
exports.parser = (input) => {
	return new Promise(function (resolve, reject) {
		try {
			let tmp = cheerio.load(input);
			const timeRange = tmp('#lblWoche').text();
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
			tmp = tmp('#tblMain').parent().html();
			tmp = tmp.replaceAll('<td>•&nbsp;</td>', '');
			// minify html for easier parsing
			tmp = minify(tmp, {
				useShortDoctype: true,
				minifyCSS: true,
				collapseWhitespace: true
			});
			// remove empty food items
			tmp = tmp.replaceAll('<tr><td></td></tr>', '');
			// remove empty row at end of table
			tmp = tmp.replaceAll(
				'<td></td><td></td><td></td><td></td><td></td>',
				''
			);
			// replace tr,div,td with food+day elements for readability
			tmp = tmp.replaceAll(
				'<td></td><td></td><td></td><td></td><td></td>',
				''
			);
			tmp = tmp.replaceAll(
				'</div></td></tr></tbody></table></td></tr></tbody></table></td><td><table><tbody><tr><td><table><tbody><tr><td><div>',
				'</food></day><day><food>'
			);
			tmp = tmp.replaceAll(
				'<td><table><tbody><tr><td><table><tbody><tr><td><div>',
				'<day><food>'
			);
			tmp = tmp.replaceAll(
				'</div></td></tr><tr><td><div>',
				'</food><food>'
			);
			tmp = tmp.replaceAll(
				'</div></td></tr></tbody></table></td></tr></tbody></table></td>',
				'</food></day>'
			);
			tmp = tmp.replaceAll(
				'</day><td></td><food>',
				'</day><day></day><day><food>'
			);
			tmp = tmp.replaceAll('<td></td>', '<day></day>');
			tmp = tmp.replaceAll('</tr><tr>', '');
			tmp = tmp.replaceAll('</th><td>', '</tr></th><td>');
			// fix end of file invalid markup
			tmp = tmp.replaceAll('</tr></tbody></table>', '</tbody></table>');
			// remove leading IDs from foods
			tmp = tmp.replaceAll(/<food>\d+ /g, '<food>');
			// remove trailing whitespace from foods
			tmp = tmp.replaceAll(' <sub>', '<sub>');
			// at this point, the html/ xml in 'tmp' is pretty readable
			// begin parsing: load html into cheerio object
			let $ = cheerio.load(input);
			const hinweis = $('#lblSpeiesplanHinweis').text();
			let days = [];
			$('.tdHeader th').each((i, e) => {
				days.push($(e).html());
			});
			days = days.filter((h) => h !== '');
			// load preprocessed html into cheerio object
			$ = cheerio.load(tmp);
			// parse markup to arrays
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
					let additives_allergies = [];
					$3('span').each(function (index, element) {
						additives_allergies.push($3(element).text());
					});
					$3('sub').remove();
					items.push({ title: $3.text(), additives_allergies });
				});
				elements.push(items);
			});
			$ = cheerio.load(input);
			const elements_unchunked = elements;
			elements = chunk(elements, days.length);
			// parse elements into final json structure
			let out = {};
			let index = 0;
			categories.forEach((c) => {
				let i = 0;
				days.forEach((d) => {
					if (!out[`${days[i]}`]) {
						out[`${days[i]}`] = {};
					}
					out[`${days[i]}`][`${categories[index]}`] =
						elements[index][i];
					i++;
				});
				index++;
			});
			resolve({
				json: out,
				html: tmp,
				hinweis,
				categories,
				timeRange,
				days,
				elements_unchunked
			});
		} catch (e) {
			reject(e);
		}
	});
};

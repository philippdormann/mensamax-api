const { fetchHTML } = require('./api/fetcher');
const { parser, getMensaPlanHTML } = require('./main');
const fs = require('fs');

(async function test() {
	try {
		const html = await fetchHTML({
			p: 'FO111',
			e: 'herz',
			kw: 17,
			provider: 'mensadigital.de'
		});
		if (html.includes('Klicken Sie hier um sich neu anzumelden')) {
			console.log('FAIL');
		} else {
			console.log('SUCCESS');
		}
		// console.log(html);
		fs.writeFileSync('./out.html', html);
		// const parsed = await parser(html);
		// console.log(parsed);
		// fs.writeFileSync('./out.json', JSON.stringify(parsed));
	} catch (error) {
		console.log(error);
	}
})();

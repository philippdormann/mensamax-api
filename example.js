const { parser, getMensaPlanHTML } = require('./main');
const fs = require('fs');

(async function test() {
	try {
		const html = await getMensaPlanHTML({
			p: 'FO111',
			e: 'herz'
		});
		// console.log(html);
		const parsed = await parser(html);
		console.log(parsed);
		fs.writeFileSync('./out.json', JSON.stringify(parsed));
	} catch (error) {
		console.log(error);
	}
})();

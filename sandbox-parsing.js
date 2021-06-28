const fs = require('fs');
const input = fs.readFileSync('./fetched.html', { encoding: 'utf-8' });
const { parser } = require('./api/parser');
(async function () {
	const json = await parser(input);
	fs.writeFileSync('./parsed.json', JSON.stringify(json));
})();

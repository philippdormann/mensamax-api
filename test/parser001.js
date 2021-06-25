const test = require('ava');
const { fetcher } = require('../api/fetcher');
const { parser } = require('../api/parser');
const fs = require('fs');

test('parsing mensadigital - P=FO111/E=herz', async (t) => {
	const html = fs.readFileSync('./test/html/001.html', { encoding: 'utf-8' });
	const expected = fs.readFileSync('./test/json/001.json', { encoding: 'utf-8' });
	const json = await parser(html);
	if (expected === JSON.stringify(json)) {
		t.pass();
	} else {
		t.fail();
	}
});

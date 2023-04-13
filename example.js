const { fetchHTML } = require('./api/fetcher');
const { parser } = require('./main');
(async function () {
	try {
		const html = await fetchHTML({ p: 'FO111', e: 'herz', kw: 15 });
		const parsed = await parser(html);
		console.log(parsed);
	} catch (e) {
		console.log(e);
	}
})();

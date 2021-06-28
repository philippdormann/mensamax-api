const { fetcher } = require('./fetcher');
const { parser } = require('./parser');
module.exports = async function start_it_up(req, res) {
	try {
		const html = await fetcher({ p: req.query.p, e: req.query.e });
		const parsed = await parser(html);
		let payload = parsed.json;
		if (req.query.details === 'true') {
			payload = parsed;
		}
		return send_it(200, { status: 'ok', payload }, req, res);
	} catch (e) {
		return send_it(500, { status: 'fail', payload: e }, req, res);
	}
};

const send_it = (status, body, req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', '*');
	res.setHeader('Content-Type', 'application/json');
	res.status(status).send(body);
};

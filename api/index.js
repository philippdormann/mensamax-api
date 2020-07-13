const request = require('request').defaults({ jar: true });
const mensaplan_parser = require('./mensaplan-parser');
const fs = require('fs');
const { join } = require('path');
let institutions = JSON.parse(
	fs.readFileSync(join(__dirname, `../institutions.json`), 'utf-8')
);
const start_it_up = (req, res) => {
	console.log(req.query);
	if (req.query.p && req.query.e) {
		let found = institutions.find(function (e) {
			return e.project == req.query.p && e.facility == req.query.e;
		});
		if (
			found.provider &&
			found.verified__VIEWSTATEGENERATOR &&
			found.tested === true
		) {
			request(
				{
					followAllRedirects: true,
					method: 'POST',
					url: `https://${found.provider}/LOGINPLAN.ASPX`,
					qs: { P: req.query.p, E: req.query.e },
					formData: {
						// TODO: we need to handle the viewstate.
						__VIEWSTATE: found.verified__VIEWSTATE,
						__VIEWSTATEGENERATOR:
							found.verified__VIEWSTATEGENERATOR,
						btnLogin: ''
					}
				},
				(error, response, body) => {
					if (error) {
						console.log(error);
						return send_it(
							500,
							{ status: 'fail', payload: error },
							req,
							res
						);
					}
					const parsed = JSON.parse(
						mensaplan_parser.Mensaplan_Parser.parse(body)
					);
					return send_it(
						200,
						{ status: 'ok', payload: parsed },
						req,
						res
					);
				}
			);
		} else {
			// TODO: more error handling
			res.send(
				`https://${found.provider}/LOGINPLAN.ASPX?p=${req.query.p}&e=${req.query.e}`
			);
		}
		console.log(found);
	} else {
		// TODO: handle missing params: return ../institutions.json ?
	}
};

const send_it = (status, body, req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', '*');
	res.setHeader('Content-Type', 'application/json');
	res.status(status).send(body);
};

module.exports = start_it_up;

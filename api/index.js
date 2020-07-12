const request = require('request').defaults({ jar: true });
const mensaplan_parser = require('./mensaplan-parser');
const fs = require('fs');

const start_it_up = (req, res) => {
	console.log(req.query);
	if (req.query.p && req.query.e) {
		// TODO: can we just include/ require the json file?
		fs.readFile('./institutions.json', 'utf8', function read(
			err,
			institutions
		) {
			if (err) {
				return send_it(
					500,
					{
						status: 'fail',
						payload: 'could not read institutions.json : '
					},
					req,
					res
				);
			} else {
				institutions = JSON.parse(institutions);
				let found = institutions.find(function (e) {
					return (
						e.project == req.query.p && e.facility == req.query.e
					);
				});
				if (found.provider) {
					request(
						{
							followAllRedirects: true,
							method: 'POST',
							url: `https://${found.provider}/LOGINPLAN.ASPX`,
							qs: { P: req.query.p, E: req.query.e },
							formData: {
								// TODO: we need to handle the viewstate
								__VIEWSTATE:
									found.verified__VIEWSTATE ||
									'G0W5d68B7sQw5+/Q3SXg4OK2k1Tj0FOKG65lU7PQ2OFbtyRUiMicA/M7mVzMyg3315D2xsJw9iECgEYY/fiSRvFwKIde0dUT05/a/saXN4yRgmFS5c3TTgCEhMUd8pejthsVoQYxDhwYyEz4ArewBw==',
								__VIEWSTATEGENERATOR:
									found.verified__VIEWSTATEGENERATOR ||
									'D5B5CA0F',
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
					res.send('öalsdfj');
				}
				console.log(found);
			}
		});
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

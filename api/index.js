const request = require('request').defaults({ jar: true });
const mensaplan_parser = require('./mensaplan-parser');

const start_it_up = (req, res) => {
	request(
		{
			followAllRedirects: true,
			method: 'POST',
			url: 'https://mensadigital.de/LOGINPLAN.ASPX',
			qs: { P: 'FO111', E: 'herz' },
			formData: {
				__VIEWSTATE:
					'G0W5d68B7sQw5+/Q3SXg4OK2k1Tj0FOKG65lU7PQ2OFbtyRUiMicA/M7mVzMyg3315D2xsJw9iECgEYY/fiSRvFwKIde0dUT05/a/saXN4yRgmFS5c3TTgCEhMUd8pejthsVoQYxDhwYyEz4ArewBw==',
				__VIEWSTATEGENERATOR: 'D5B5CA0F',
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
			return send_it(200, { status: 'ok', payload: parsed }, req, res);
		}
	);
};

const send_it = (status, body, req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', '*');
	res.setHeader('Content-Type', 'application/json');
	res.status(status).send(body);
};

module.exports = start_it_up;

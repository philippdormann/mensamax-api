let request = require('request');
let mensaplan_parser = require('./mensaplan-parser');
request = request.defaults({ jar: true });

let start_it_up = (req, res) => {
	request(
		{
			followAllRedirects: true,
			method: 'POST',
			url: 'https://mensadigital.de/LOGINPLAN.ASPX',
			qs: { P: 'FO111', E: 'herz' },
			headers: {
				'content-type':
					'multipart/form-data; boundary=---011000010111000001101001'
			},
			formData: {
				__VIEWSTATE:
					'G0W5d68B7sQw5+/Q3SXg4OK2k1Tj0FOKG65lU7PQ2OFbtyRUiMicA/M7mVzMyg3315D2xsJw9iECgEYY/fiSRvFwKIde0dUT05/a/saXN4yRgmFS5c3TTgCEhMUd8pejthsVoQYxDhwYyEz4ArewBw==',
				__VIEWSTATEGENERATOR: 'D5B5CA0F',
				btnLogin: ''
			}
		},
		function (error, response, body) {
			if (error) throw new Error(error);

			console.log("ALL GOOD, LET'S GO");
			console.log('****************');

			parse_it(body, response, req, res);
		}
	);
};

const parse_it = (body, response, req, res) => {
	const parsed = mensaplan_parser.Mensaplan_Parser.parse(body);
	send_it(parsed, req, res);
};

const send_it = (parsed, req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', '*');
	res.setHeader('Content-Type', 'application/json');
	res.status(200).send(parsed);
};

module.exports = start_it_up;

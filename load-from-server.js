const fs = require('fs');
var request = require('request');
request = request.defaults({ jar: true });

var options = {
	followAllRedirects: true,
	method: 'POST',
	url: 'https://mensadigital.de/LOGINPLAN.ASPX',
	qs: { P: 'FO111', E: 'herz' },
	headers: { 'content-type': 'multipart/form-data; boundary=---011000010111000001101001' },
	formData: {
		__VIEWSTATE:
			'G0W5d68B7sQw5+/Q3SXg4OK2k1Tj0FOKG65lU7PQ2OFbtyRUiMicA/M7mVzMyg3315D2xsJw9iECgEYY/fiSRvFwKIde0dUT05/a/saXN4yRgmFS5c3TTgCEhMUd8pejthsVoQYxDhwYyEz4ArewBw==',
		__VIEWSTATEGENERATOR: 'D5B5CA0F',
		btnLogin: ''
	}
};

request(options, function(error, response, body) {
	if (error) throw new Error(error);

	console.log("ALL GOOD, LET'S GO");
	console.log('****************');

	console.log(response);
	console.log('----------------');
	console.log(body);
	console.log('----------------');

	//

	fs.writeFile('test.html', body, function(err) {
		if (err) {
			return console.log(err);
		}
		console.log('The file was saved!');
	});
	//
	fs.writeFile('response.json', JSON.stringify(response), function(err) {
		if (err) {
			return console.log(err);
		}
		console.log('The file was saved!');
	});
});

/*
start express web server on port 3000
post request to https://mensadigital.de/LOGINPLAN.ASPX?P=FO111&E=herz
print the response to the screen
*/
var express = require('express');
var app = express();
var request = require('request');

var options = {
	method: 'POST',
	followAllRedirects: true,
	url: 'https://mensadigital.de/LOGINPLAN.ASPX',
	qs: { P: 'FO111', E: 'herz' },
	headers: { 'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
	formData: {
		__VIEWSTATE:
			'/wEPDwUJODQ5MDQ3NzI3D2QWAmYPZBYEAgEPDxYCHgRUZXh0BQVGTzExMWRkAgIPDxYCHwAFBGhlcnpkZGS0fKrirWn0k/UdgWunNZPR8jF3ShBdJIWVB0yGj1GA2w==',
		__VIEWSTATEGENERATOR: 'D5B5CA0F',
		btnLogin: ''
	}
};

app.get('/', function(req, res) {
	request(options, function(error, response, body) {
		if (error) throw new Error(error);
		res.send(body);
	});
});

app.listen(3000, function() {
	console.log('app now listening on port 3000!');
});

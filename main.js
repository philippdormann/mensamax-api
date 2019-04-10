var http = require('https');

var options = {
	method: 'POST',
	hostname: [ 'mensadigital', 'de' ],
	path: [ 'LOGINPLAN.ASPX' ],
	headers: {
		'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
	}
};

var req = http.request(options, function(res) {
	var chunks = [];

	res.on('data', function(chunk) {
		chunks.push(chunk);
	});

	res.on('end', function() {
		var body = Buffer.concat(chunks);
		console.log(body.toString());
	});
});

req.write(
	'------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="__VIEWSTATE"\r\n\r\n/wEPDwUJODQ5MDQ3NzI3D2QWAmYPZBYEAgEPDxYCHgRUZXh0BQVGTzExMWRkAgIPDxYCHwAFBGhlcnpkZGS0fKrirWn0k/UdgWunNZPR8jF3ShBdJIWVB0yGj1GA2w==\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="__VIEWSTATEGENERATOR"\r\n\r\nD5B5CA0F\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="btnLogin"\r\n\r\n\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--'
);
req.end();

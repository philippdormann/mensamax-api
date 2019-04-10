/* 
post request to https://mensadigital.de/LOGINPLAN.ASPX?P=FO111&E=herz , then copy the response to clipboard
*/
var http = require('https');

var options = {
	method: 'POST',
	hostname: 'mensadigital.de',
	port: null,
	path: '/LOGINPLAN.ASPX?P=FO111&E=herz',
	headers: {
		cookie: 'ASP.NET_SessionId=bh1455pbabicr5qntcdf0ueu',
		'content-length': '0',
		'content-type': 'multipart/form-data; boundary=---011000010111000001101001'
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
	'-----011000010111000001101001\r\nContent-Disposition: form-data; name="__VIEWSTATE"\r\n\r\n/wEPDwUJODQ5MDQ3NzI3D2QWAmYPZBYEAgEPDxYCHgRUZXh0BQVGTzExMWRkAgIPDxYCHwAFBGhlcnpkZGS0fKrirWn0k/UdgWunNZPR8jF3ShBdJIWVB0yGj1GA2w=='
);
req.end();

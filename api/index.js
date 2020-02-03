const cheerio = require('cheerio');
let minify = require('html-minifier').minify;
let request = require('request');
request = request.defaults({ jar: true });

module.exports = (req, res) => {
	start_it_up(req, res);
};

let start_it_up = (req, res) => {
	request(
		{
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
		},
		function(error, response, body) {
			if (error) throw new Error(error);

			console.log("ALL GOOD, LET'S GO");
			console.log('****************');

			parse_it(body, response, req, res);
		}
	);
};

let parse_it = (body, response, req, res) => {
	let html = body;
	let $ = cheerio.load(html);
	$('[style*="color:red"]').remove();
	$('[style*="width:30%"]').remove();
	$('[style*="border-spacing:0;padding:0"]').remove();
	$('#lblMeineBestellungen').remove();
	$('#lblLegende1').remove();
	$('#lblSpeiesplanHinweis').remove();
	$('#btnHideImage').remove();
	$('#strDetails').remove();

	$('sub').remove();
	let mensaplan_info = $('#lblWoche').html();

	parsed = $.html();
	parsed = $('table#tblMain').html();
	parsed = minifyHTML(parsed); //minify

	// remove unusable styles + attrs
	parsed = parsed.replace(
		/ cellpadding="1" border="0" style="height:100%;width:100%;border-collapse:collapse;padding:0"/g,
		''
	);
	parsed = parsed.replace(/ cellpadding="1" border="0" style="width:99%"/g, '');
	parsed = parsed.replace(/ style="width:100%;overflow:hidden"/g, '');
	parsed = parsed.replace(/ style="border-collapse:collapse;padding:0"/g, '');
	parsed = parsed.replace(/ class="tdFooter2" style="background-color:#d0e0ff"/g, '');
	parsed = parsed.replace(/ class="tdFooter3" style="height:45px"/g, ' ');
	parsed = parsed.replace(/ style="font-weight:700"/g, '');
	// 3758 Grießbrei 'n' stuff
	parsed = parsed.replace(/padding:0"><div>[\d]+/g, 'padding:0"><div>');
	parsed = parsed.replace(/padding:0"><div> /g, 'padding:0"><div>');
	// Wackelpudding 002 'n' stuff
	parsed = parsed.replace(/ [\d]+<\/div>/g, '</div>');
	// more
	parsed = parsed.replace(/ valign="top" style="border-spacing:0;padding:0"/g, '');
	parsed = parsed.replace(/ class="tdFooter3"/g, '');
	parsed = parsed.replace(/ class="tdFooter" style="background-color:#d0e0ff"/g, ' ');
	parsed = parsed.replace(/<tr style="height:auto"><td valign="top" colspan="3">/g, '<tr><td>');
	parsed = parsed.replace(/ align="center" valign="middle"/g, '');
	parsed = parsed.replace(/ colspan="2" style="height:5px"/g, '');
	parsed = parsed.replace(/ align="center" style="width:100px"/g, '');
	parsed = parsed.replace(/<tr class="tdHeader"><th style="width:10%;background-color:#f0f0ff"><\/th>/g, '<title>');
	parsed = parsed.replace(/<tr class="tdFooter">(?:.*)<\/tr><\/tbody>/g, '</tbody>'); //remove footer
	parsed = parsed.replace(/ >/g, '>'); // remove weird whitespace in "<tr >"
	// remove last IDs
	parsed = parsed.replace(/<td id="td[\d]+_[\d]+">/g, '<td>');

	// JS encoded umlauts
	parsed = parsed.replace(/&#xE4;/g, 'ä');
	parsed = parsed.replace(/&#xC4;/g, 'Ä');
	parsed = parsed.replace(/&#xF6;/g, 'ö');
	parsed = parsed.replace(/&#xD6;/g, 'Ö');
	parsed = parsed.replace(/&#xFC;/g, 'ü');
	parsed = parsed.replace(/&#xDC;/g, 'Ü');
	parsed = parsed.replace(/&#xDF;/g, 'ß');
	parsed = parsed.replace(/&#x1E9E;/g, 'ß');
	parsed = parsed.replace(/&#xE9;/g, 'é');
	parsed = parsed.replace(/&#xE8;/g, 'è');
	parsed = parsed.replace(/&quot;/g, "'"); //&quot;
	parsed = parsed.replace(/&#x2022;&#xA0;/g, '');

	//--- processing to useful stuff start
	//*** title
	parsed = parsed.replace(/<\/th><\/tr>/g, '</title>');
	parsed = parsed.replace(/<th>/g, '<title-item>');
	parsed = parsed.replace(/<\/th>/g, '</title-item>');
	parsed = parsed.replace(/<\/title>/g, '</title-item></title>');

	// more
	parsed = parsed.replace(/<div>/g, '<essen>');
	parsed = parsed.replace(/<\/div>/g, '</essen>');
	// special case (Nachtisch - 3 filled, 1 empty)
	parsed = parsed.replace(
		/<\/td><\/tr><\/tbody><\/table><\/td><\/tr><tr><\/tr><\/tbody><\/table><\/td><td><\/td><\/tr><tr><td>/,
		'</day><day><essen></essen></day><category>'
	);
	parsed = parsed.replace(
		/<\/essen><\/td><\/tr><\/tbody><\/table><\/td><\/tr><tr><\/tr><\/tbody><\/table><\/td><td><table><tbody><tr><td><table><tbody><tr><td><\/td><\/tr><tr><td><\/td><td>/g,
		'</essen></day><day>'
	);
	parsed = parsed.replace(
		/<\/essen><\/td><\/tr><\/tbody><\/table><\/td><\/tr><tr><\/tr><\/tbody><\/table><\/td><td><\/td><\/tr><tr><td>/g,
		'</essen></day><category>'
	);
	parsed = parsed.replace(
		/<\/td><td><table><tbody><tr><td><table><tbody><tr><td><\/td><\/tr><tr><td><\/td><td><essen>/g,
		'</category><day><essen>'
	);
	parsed = parsed.replace(/<\/essen><\/td><\/tr><tr><td><\/td><td><essen>/g, '</essen><essen>');
	parsed = parsed.replace(
		/<\/td><\/tr><\/tbody><\/table><\/td><\/tr><tr><\/tr><\/tbody><\/table><\/td><\/tr><tr><td>/g,
		'</day><category>'
	);
	// special case (Nachtisch alternativ - 3 empty, 1 filled)
	parsed = parsed.replace(
		/<\/td><td><\/td><td><\/td><td><\/category>/g,
		'</category><day><essen></essen></day><day><essen></essen></day><day><essen></essen></day>'
	);
	// first element
	parsed = parsed.replace(/<tr><td>/g, '<category>');
	// last element
	parsed = parsed.replace(
		/<\/essen><\/td><\/tr><\/tbody><\/table><\/td><\/tr><tr><\/tr><\/tbody><\/table><\/td><\/tr><\/tbody>/g,
		'</essen></day><END>'
	);

	//--- to JSON
	parsed = parsed.replace(/<\/title-item><\/title>/g, '"],"list":[');
	parsed = parsed.replace(/<\/title-item><title-item>/g, '","');
	parsed = parsed.replace(/<tbody><title><title-item>/g, '{"titles":["');
	parsed = parsed.replace(/<category>/g, '{"category":"');
	parsed = parsed.replace(/<\/category>/g, '","days":[');
	parsed = parsed.replace(/<\/essen><\/day><day><essen>/g, '"],["');
	parsed = parsed.replace(/<day><essen>/g, '["');
	parsed = parsed.replace(/<\/essen><essen>/g, '","');
	parsed = parsed.replace(/<\/essen><\/day>/g, '"]]},');

	// append general infos about the plan
	mensaplan_info = mensaplan_info.replace(/<b>/g, '');
	mensaplan_info = mensaplan_info.replace(/<\/b>/g, '');
	let mensaplan_details = mensaplan_info.split(' - ');
	mensaplan_details.full = mensaplan_info;
	mensaplan_details.start = mensaplan_details[0];
	mensaplan_info_modified = mensaplan_info.replace(/ \(KW(?:.*)/g, '');
	mensaplan_details.end = mensaplan_info_modified.split(' - ');
	mensaplan_details.end = mensaplan_details.end[1];
	mensaplan_details.kw = mensaplan_info.split(' (KW');
	mensaplan_details.kw = mensaplan_details.kw[1];
	mensaplan_details.kw = mensaplan_details.kw.replace(/\)/g, '');

	let server_data = { headers: response.headers, request: response.request };
	server_data = JSON.stringify(server_data);

	let appended_info =
		'],"full":"' +
		mensaplan_details.full +
		'","start":"' +
		mensaplan_details.start +
		'","end":"' +
		mensaplan_details.end +
		'","kw":"' +
		mensaplan_details.kw +
		'","server_data":' +
		server_data +
		'}';

	parsed = parsed.replace(/,<END>/g, appended_info);

	send_it(parsed, req, res);
};

let send_it = (parsed, req, res) => {
	res.setHeader('Content-Type', 'application/json');
	res.status(200).send(parsed);
};

let minifyHTML = (html) => {
	return minify(html, {
		useShortDoctype: true,
		minifyCSS: true,
		html5: true,
		collapseWhitespace: true,
		removeComments: true,
		removeEmptyAttributes: true
	});
};

const cheerio = require('cheerio');
let minify = require('html-minifier').minify;
exports.Mensaplan_Parser = {
	server_data: {},
	parse: (html) => {
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
		parsed = minify(parsed, {
			useShortDoctype: true,
			minifyCSS: true,
			collapseWhitespace: true
		});

		parsed = parsed.replace(/ class="tdFooter3" style="height:auto"/g, '');
		parsed = parsed.replace(
			/ cellpadding="1" border="0" style="height:100%;width:100%;border-collapse:collapse;padding:0"/g,
			''
		);
		parsed = parsed.replace(/ class="tdFooter3"/g, '');
		parsed = parsed.replace(/ valign="top" colspan="3"/g, '');
		parsed = parsed.replace(/ colspan="2" style="height:5px"/g, '');
		parsed = parsed.replace(/ style="width:100%;overflow:hidden"/g, '');
		parsed = parsed.replace(/padding:0"><div>[\d]+ /g, 'padding:0"><div>');
		parsed = parsed.replace(/ valign="top" style="border-spacing:0;padding:0"/g, '');
		parsed = parsed.replace(/ cellpadding="1" border="0" style="width:99%"/g, '');
		parsed = parsed.replace(/ style="height:45px"/g, '');
		parsed = parsed.replace(
			/<tr class="tdFooter" style="background-color:#d0e0ff"><td style="font-weight:700">/g,
			'<category>'
		);
		parsed = parsed.replace(/<\/td><td id="td0/g, '</category><td id="td0');
		parsed = parsed.replace(
			/<tr class="tdFooter2" style="background-color:#d0e0ff"><td style="font-weight:700">/g,
			'<category>'
		);

		parsed = parsed.replace(/<th style="width:10%;background-color:#f0f0ff"><\/th>/g, '');
		parsed = parsed.replace(/<\/th><th align="center" style="width:100px">/g, '</title-item><title-item>');
		parsed = parsed.replace(/<\/th><\/tr>/g, '</title-item></title>');
		parsed = parsed.replace(/<tr class="tdHeader"><th align="center" style="width:100px">/g, '<title><title-item>');
		parsed = parsed.replace(/ [\d]+<\/div>/g, '</div>'); // Wackelpudding 002, 003 'n' stuff
		parsed = parsed.replace(/<tr class="tdFooter">(?:.*)<\/tr><\/tbody>/g, '</tbody>'); //remove footer

		//
		parsed = parsed.replace(/ style="border-collapse:collapse;padding:0"/g, '');
		parsed = parsed.replace(/ (id=("[^"]*"|))/g, ''); //remove IDs
		//
		parsed = parsed.replace(/<td>&#x2022;&#xA0;<\/td>/g, '');
		parsed = parsed.replace(/<td align="center" valign="middle"><\/td>/g, '<food></food>');
		parsed = parsed.replace(
			/<\/div><\/td><\/tr><\/tbody><\/table><\/td><\/tr><tr><\/tr><\/tbody><\/table><\/td><food><\/food><td><table><tbody><tr><td><table><tbody><tr><td><\/td><\/tr><tr><td><div>/g,
			'</food></day><day><food></food></day><day><food>'
		);
		parsed = parsed.replace(
			/<\/div><\/td><\/tr><\/tbody><\/table><\/td><\/tr><tr><\/tr><\/tbody><\/table><\/td>/g,
			'</food>'
		);
		parsed = parsed.replace(
			/<\/category><td><table><tbody><tr><td><table><tbody><tr><td><\/td><\/tr><tr><td><div>/g,
			'</category><day><food>'
		);
		parsed = parsed.replace(
			/<\/div><\/td><\/tr><\/tbody><\/table><\/td><\/tr><tr><\/tr><\/tbody><\/table><\/td><\/tr>/g,
			'</food></day>'
		);
		//
		parsed = parsed.replace(
			/<\/div><\/td><\/tr><\/tbody><\/table><\/td><\/tr><tr><\/tr><\/tbody><\/table><\/td><td><table><tbody><tr><td><table><tbody><tr><td><\/td><\/tr><tr><td><div>/g,
			'</food></day><day><food>'
		);
		// multiple food per category in day
		parsed = parsed.replace(/<\/div><\/td><\/tr><tr><td><div>/g, '</food><food>');
		// next day
		parsed = parsed.replace(
			/<td><table><tbody><tr><td><table><tbody><tr><td><\/td><\/tr><tr><td><div>/g,
			'</day><day><food>'
		);

		parsed = parsed.replace(/<\/tr>/g, '</day>'); // day closing

		parsed = parsed.replace(/<\/td>/g, '</category>'); // last buggy td tag

		parsed = parsed.replace(/<tbody>/g, ''); // tbody

		//-- locked days support [WIP]
		parsed = parsed.replace(/ style="[^\"]*"/gi, '');
		parsed = parsed.replace(
			/ align="center" valign="middle" title="gesperrter Tag" alt="gesperrter Tag"/gi,
			' lockedDay'
		);
		parsed = parsed.replace(/<td lockedDay>Keine Ausgabe<br><br>(.+?)<\/category>/gi, '<day><food>$1</food>');
		//-- locked days support [WIP]

		parsed = this.Mensaplan_Parser.encode_umlauts(parsed);
		parsed = this.Mensaplan_Parser.to_json(parsed);

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

		let appended_info =
			'"full":"' +
			mensaplan_details.full +
			'","start":"' +
			mensaplan_details.start +
			'","end":"' +
			mensaplan_details.end +
			'","kw":"' +
			mensaplan_details.kw +
			'","server_data":' +
			JSON.stringify(this.Mensaplan_Parser.server_data) +
			'}';

		parsed = parsed + `,"info":{${appended_info}}`;
		return parsed;
	},
	to_json: (parsed) => {
		parsed = parsed.replace(/<title><title-item>/g, '{"titles":["');
		parsed = parsed.replace(/<\/title-item><title-item>/g, '","');
		parsed = parsed.replace(/<\/title-item><\/title>/g, '"],"list":[');
		parsed = parsed.replace(/<category>/g, '{"category":"');
		parsed = parsed.replace(/<\/category>/g, '","days":[[');
		parsed = parsed.replace(/<\/food><food>/g, '","');
		parsed = parsed.replace(/<food>/g, '"');
		parsed = parsed.replace(/<\/food>/g, '"');
		parsed = parsed.replace(/<category>/g, '"category":"');
		parsed = parsed.replace(/<\/day><day>/g, '],[');
		parsed = parsed.replace(/<day>/g, '');
		parsed = parsed.replace(/<\/day><\/tbody>/g, ']]}]');
		// parsed = parsed.replace(/<\/day><\/tbody>/g, ']]}]}');
		parsed = parsed.replace(/<\/day>/g, ']]},');

		return parsed;
	},
	encode_umlauts: (parsed) => {
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
		parsed = parsed.replace(/&quot;/g, "'");
		return parsed;
	}
};

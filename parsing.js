const fs = require('fs');
const mensaplan_parser = require('./api/mensaplan-parser');

fs.readFile('test.html', function (err, data) {
	if (err) return console.error(err);
	let html = data.toString();

	let parsed = mensaplan_parser.Mensaplan_Parser.parse(html);

	log_it(parsed, 'parsed.json');
	log_it(parsed, 'parsed.html');
});

let log_it = (data, file) => {
	fs.writeFile(file, data, function (err) {
		if (err) {
			return console.log(err);
		}
		console.log(`The file ${file} was saved!`);
	});
};

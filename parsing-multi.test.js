const fs = require('fs');
const path = require('path');
const mensaplan_parser = require('./api/mensaplan-parser');

let log_it = (data, file) => {
	fs.writeFile(file, data, function(err) {
		if (err) {
			return console.log(err);
		}
		console.log(`The file ${file} was saved!`);
	});
};

const folder_name = 'raw-samples';
const directoryPath = path.join(__dirname, folder_name);

fs.readdir(directoryPath, function(err, files) {
	if (err) {
		return console.log('Unable to scan directory: ' + err);
	}
	files.forEach(function(file) {
		let kw = file.replace(/.html/g, '');
		fs.readFile(`${folder_name}/${file}`, function(err, data) {
			if (err) return console.error(err);
			let html = data.toString();

			console.log(`parsing 'KW${kw}' ...`);

			console.log(html);
			console.log('----------------');

			let parsed = mensaplan_parser.Mensaplan_Parser.parse(html);

			log_it(parsed, `parsed-samples/${kw}.parsed.json`);
		});
	});
});

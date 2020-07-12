const fs = require('fs');
module.exports = (rel = '/', req, res) => {
	fs.readFile(rel + 'web-template.html', 'utf8', function read(
		err,
		templateData
	) {
		if (err) {
			console.log(err);
			return res.status(500).end();
		} else {
			fs.readFile(rel + 'index.html', 'utf8', function read(
				err,
				content
			) {
				if (err) {
					console.log(err);
					return res.status(500).end();
				} else {
					const rendered = templateData.replace(
						/{{{content}}}/gi,
						content
					);
					return res.send(rendered);
				}
			});
		}
	});
};

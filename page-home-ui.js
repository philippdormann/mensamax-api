const fs = require('fs');
const templateData = fs.readFileSync('./web-template.html', 'utf-8');
const content = fs.readFileSync('./home.html', 'utf-8');
module.exports = (req, res) => {
	const rendered = templateData.replace(/{{{content}}}/gi, content);
	return res.send(rendered);
};

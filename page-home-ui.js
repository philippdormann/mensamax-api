const fs = require('fs');
const { join } = require('path');
const templateData = fs.readFileSync(
	join(__dirname, `web-template.html`),
	'utf-8'
);
const content = fs.readFileSync(join(__dirname, `home.html`), 'utf-8');
module.exports = (req, res) => {
	const rendered = templateData.replace(/{{{content}}}/gi, content);
	return res.send(rendered);
};

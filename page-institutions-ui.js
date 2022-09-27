const fs = require('fs');
const { join } = require('path');
const templateData = fs.readFileSync(
	join(__dirname, `web-template.html`),
	'utf-8'
);
const institutions = require('./institutions.json');
module.exports = (req, res) => {
	let table = '';
	table += `<p>Currently, there are <u>${institutions.length}</u> sources in this list.<br>Can't find your organisation? <a href="https://github.com/philippdormann/mensamax-api/issues/new">Create a new GitHub issue.</a></p>`;
	institutions.forEach((src) => {
		let tested_insert = '❓ not tested';
		if (src.tested) {
			tested_insert = `👍 tested on: ${src.tested}`;
		}
		regCode = src.code || '?';
		//
		src.sample_url = `https://${src.provider}/LOGINPLAN.ASPX?P=${src.project}&E=${src.facility}`;
		table += `
						<h4>${src.name}</h4>
						${tested_insert}
						<br>
						Project: <code data-clipboard-text="${src.project}">${src.project}</code>
						<br>
						Facility: <code data-clipboard-text="${src.facility}">${src.facility}</code>
						<br>
						registration code: <code data-clipboard-text="${regCode}">${regCode}</code>
						<br>
						data provider: <code data-clipboard-text="${src.provider}">${src.provider}</code>
						<br>
						raw link: <a target="_blank" href="${src.sample_url}">${src.sample_url}</a>
						<br>
						api link simple: <a target="_blank" href="../api/?p=${src.project}&e=${src.facility}">/api/?p=${src.project}&e=${src.facility}</a>
						<br>
						api link details: <a target="_blank" href="../api/?p=${src.project}&e=${src.facility}&details=yes">/api/?p=${src.project}&e=${src.facility}&details=yes</a>
						<hr>
						`;
	});
	const rendered = templateData.replace(/{{{content}}}/gi, table);
	res.end(rendered);
};

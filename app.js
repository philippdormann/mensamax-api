var express = require('express');
var app = express();
const puppeteer = require('puppeteer');

app.get('/', function(req, res) {
	async function loadPage() {
		const browser = await puppeteer.launch({
			args: [ '--no-sandbox', '--disable-setuid-sandbox' ]
		});
		const page = await browser.newPage();
		await page.goto('https://mensadigital.de/LOGINPLAN.ASPX?P=FO111&E=herz');
		// await page.screenshot({ path: 'mensa01.png' });
		let htmlSource = await page.evaluate(() => document.body.outerHTML);
		res.send(htmlSource);
		await browser.close();
	}

	loadPage();
});

app.listen(80, function() {
	console.log('app now listening on port 80!');
});

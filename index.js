var express = require('express');
const app = express();
const puppeteer = require('puppeteer');

app.get('/', async (req, res) => {
	const browser = await puppeteer.launch({
		args: [ '--no-sandbox', '--disable-setuid-sandbox' ]
	});
	const page = await browser.newPage();
	await page.goto('https://mensadigital.de/LOGINPLAN.ASPX?P=FO111&E=herz');
	let htmlSource = await page.evaluate(() => document.body.outerHTML);
	res.status(200).json({ htmlSource });

	await browser.close();

	// let response = { data: 'lelele' };

	// res.status(200).json(response);
});

app.listen(3000, () => {
	console.log('listening...');
});

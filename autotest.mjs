import { fetchHTML } from './api/fetcher.js';
import { parser } from './api/parser.js';
import fs from 'fs';
let institutions = JSON.parse(fs.readFileSync('./institutions.json'));
let currentDate = new Date();
let cDay = currentDate.getDate().toString().padStart(2, '0');
let cMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
let cYear = currentDate.getFullYear().toString();
let resultPassedString = `${cYear}-${cMonth}-${cDay}`;
let results = [];
for await (let i of institutions) {
	console.log(`starting validation for p=${i.project}&e=${i.facility}`);
	try {
		const html = await fetchHTML({ p: i.project, e: i.facility });
		await parser(html);
		i.tested = resultPassedString;
	} catch (e) {
		i.tested = false;
	}
	results.push(i);
	console.log(`finished validation for p=${i.project}&e=${i.facility}`);
	fs.writeFileSync('./validated.json', JSON.stringify(results));
	console.log(`updated validated.json`);
}

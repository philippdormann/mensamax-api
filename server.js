(async () => {
	const rayo = await (await import('rayo')).default;
	const main = require('./api/index');
	const institutionsPage = require('./page-institutions-ui');
	const homePage = require('./page-home-ui');
	require('dotenv').config();
	const port = process.env.PORT || 80;
	const app = rayo({ port });
	const institutions = require('./institutions.json');
	const institutionsString = JSON.stringify(institutions);

	app.all('/institutions-json', (req, res) => res.end(institutionsString));
	app.all('/institutions-ui', (req, res) => institutionsPage(req, res));
	app.all('/api', (req, res) => main(req, res));
	app.all('*', (req, res) => homePage(req, res));

	app.start();
	console.log(`app listening on port ${port}`);
})().catch((err) => console.error(err));

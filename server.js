const express = require('express');
const main = require('./api/index');
const institutionsPage = require('./page-institutions-ui');
const homePage = require('./page-home-ui');
const app = express();
const port = process.env.PORT || 80;

app.use('/institutions-json', (req, res) =>
	res.sendFile('./institutions.json', { root: './' })
);
app.use('/institutions-ui', (req, res) => institutionsPage(req, res));
app.use('/api', (req, res) => main(req, res));
app.use('*', (req, res) => homePage(req, res));

app.listen(port, () => console.log(`listening on port ${port}!`));

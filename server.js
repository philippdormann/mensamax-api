const express = require('express');
const main = require('./api/index');
const app = express();

app.use('/institutions-json', (req, res) =>
	res.sendFile('./institutions.json', { root: './' })
);
app.use(['/institutions-ui'], (req, res) => {
	return res.send(
		'TODO: this should be a nice new.css page with a parsed list'
	);
});
app.use('/api', (req, res) => main(req, res));
app.use('*', (req, res) => res.sendFile('./index.html', { root: './' }));

app.listen(80, () => console.log('listening on port 80!'));

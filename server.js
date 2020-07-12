const express = require('express');
const start_it_up = require('./api/index');
const app = express();

app.use(['/list', '/institutes'], (req, res) => {
	return res.send();
});
app.use('/api', (req, res) => {
	return start_it_up(req, res);
});
app.use('*', (req, res) => {
	return res.sendFile('./index.html', { root: './' });
});

app.listen(80, () => console.log('listening on port 80!'));

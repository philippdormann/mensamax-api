const express = require('express');
const start_it_up = require('./api/index');
const app = express();

app.use('/docs', (req, res) => {
	// return res.redirect('https://github.com/philippd1/gymhmensa');
	return res.sendFile('./index.html', { root: './' });
});
app.use('/list', (req, res) => {
	return res.send();
});
app.use('*', (req, res) => {
	return start_it_up(req, res);
});

app.listen(80, () => console.log('listening on port 80!'));

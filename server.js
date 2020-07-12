let request = require('request');
const express = require('express');
const start_it_up = require('./api/index');
// const mensaplan_parser = require('./api/mensaplan-parser');
let app = express();
request = request.defaults({ jar: true });

app.use('/docs', (req, res) => {
	return res.redirect('https://github.com/philippd1/gymhmensa');
});
app.use('*', (req, res) => {
	return start_it_up(req, res);
});

app.listen(80, () => console.log('listening on port 80!'));

const { fetcher } = require('./api/fetcher');
const { parser } = require('./api/parser');
const institutions = require('./institutions.json');
//
exports.fetcher = fetcher;
exports.parser = parser;
exports.institutions = institutions;

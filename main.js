const { fetcher, getMensaPlanHTML } = require('./api/fetcher');
const { parser } = require('./api/parser');
const institutions = require('./institutions.json');
//
exports.getMensaPlanHTML = getMensaPlanHTML;
exports.fetcher = fetcher;
exports.parser = parser;
exports.institutions = institutions;

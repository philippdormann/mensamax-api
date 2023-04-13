const { fetchHTML, getMensaPlanHTML } = require('./api/fetcher');
const { parser } = require('./api/parser');
const institutions = require('./institutions.json');
//
exports.getMensaPlanHTML = getMensaPlanHTML;
exports.fetchHTML = fetchHTML;
exports.parser = parser;
exports.institutions = institutions;

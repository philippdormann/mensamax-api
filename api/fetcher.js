require('dotenv').config();
const request = require('request').defaults({ jar: true });
const cheerio = require('cheerio');
const axios = require('axios').default;
const institutions = require('../institutions.json');
// =========
const mensaplanCache = { cacheTimestamp: 0, cacheContent: {} };
// =========
/**
 * @returns {string} html content of mensaplan
 */
function getMensaplanHTML({ p, e }) {
	return new Promise(function (resolve, reject) {
		if (p && e) {
			const found = institutions.find(function (ins) {
				return ins.project === p && ins.facility === e;
			});
			if (found) {
				if (process.env.CACHE === 'NONE') {
					return fetch({ p, e });
				} else {
					const cacheTimeMinutes = parseInt(
						process.env.CACHE_TIME_MINUTES || 1
					);
					if (
						Date.now() >
						mensaplanCache.cacheTimestamp +
							cacheTimeMinutes * 60 * 1000
					) {
						// reload data
						mensaplanCache.cacheTimestamp = Date.now();
						fetchHTML({ p, e, provider: found.provider }).then(
							(data) => {
								mensaplanCache.cacheContent = data;
								resolve(mensaplanCache.cacheContent);
							}
						);
					} else {
						// still in cache
						resolve(mensaplanCache.cacheContent);
					}
				}
			} else {
				reject('404');
			}
		} else {
			reject('parameters');
		}
	});
}
// =========
/**
 * @returns {string} html content of mensaplan
 */
function fetchHTML({ p, e, provider }) {
	return new Promise(function (resolve, reject) {
		axios
			.get(`https://${provider}/LOGINPLAN.ASPX`, {
				params: { p, e },
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			})
			.then(function (response) {
				const $ = cheerio.load(response.data);
				const __VIEWSTATE = $('#__VIEWSTATE').val();
				const __VIEWSTATEGENERATOR = $('#__VIEWSTATEGENERATOR').val();
				request(
					{
						followAllRedirects: true,
						method: 'POST',
						url: `https://${provider}/LOGINPLAN.ASPX`,
						qs: { p, e },
						formData: {
							__VIEWSTATE,
							__VIEWSTATEGENERATOR,
							btnLogin: ''
						}
					},
					(error, response, body) => {
						if (error) {
							reject('fetch_step2');
						} else {
							resolve(body);
						}
					}
				);
			})
			.catch(function (error) {
				reject('fetch_step1');
			});
	});
}
exports.getMensaplanHTML = getMensaplanHTML;
exports.fetcher = fetchHTML;

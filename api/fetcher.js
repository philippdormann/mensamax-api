require('dotenv').config();
const request = require('request').defaults({ jar: true });
const cheerio = require('cheerio');
const axios = require('axios').default;
const institutions = require('../institutions.json');
// =========
const mensaplanCache = [];
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
				// console.log(mensaplanCache);
				if (process.env.CACHE === 'none') {
					fetchHTML({ p, e, provider: found.provider }).then(
						(data) => {
							resolve(data);
						}
					);
				} else {
					const cacheTime = parseInt(
						process.env.CACHE_TIME_MINUTES || 1
					);
					const cache = mensaplanCache.find(
						(i) =>
							i.ts + cacheTime * 60 * 1000 > Date.now() &&
							i.key === `${p}${e}${found.provider}`
					);
					if (cache) {
						// still in cache
						console.log('resolve::cache');
						resolve(cache.content);
					} else {
						// reload data
						fetchHTML({ p, e, provider: found.provider }).then(
							(data) => {
								console.log('resolve::fresh');
								mensaplanCache.push({
									ts: Date.now(),
									content: data,
									key: `${p}${e}${found.provider}`
								});
								resolve(data);
							}
						);
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

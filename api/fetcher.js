require('dotenv').config();
const request = require('request').defaults({ jar: true });
const cheerio = require('cheerio');
const axios = require('axios').default;
const institutions = require('../institutions.json');
// =========
let redisclient = undefined;
if (process.env.CACHE === 'redis') {
	if (process.env.CACHE_REDIS_URL) {
		const Redis = require('ioredis');
		redisclient = new Redis(process.env.CACHE_REDIS_URL);
	} else {
		process.env.CACHE = 'memory';
	}
}
const mensaplanCache = [];
// =========
function getCacheItem(key, expiry) {
	return new Promise(function (resolve, reject) {
		if (process.env.CACHE === 'redis') {
			redisclient
				.get(key)
				.then((result) => {
					if (result) {
						resolve({ content: result });
					} else {
						resolve(undefined);
					}
				})
				.catch((e) => {
					resolve(undefined);
				});
		} else {
			const cacheItem = mensaplanCache.find(
				(i) => i.ts > expiry && i.key === key
			);
			if (cacheItem) {
				resolve(cacheItem);
			} else {
				reject(expiry);
			}
		}
	});
}
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
					getCacheItem(
						`${p}${e}${found.provider}`,
						Date.now() - cacheTime * 60 * 1000
					)
						.then((cache) => {
							if (cache) {
								// serve from cache
								resolve(cache.content);
							} else {
								// load fresh data
								fetchHTML({
									p,
									e,
									provider: found.provider
								}).then((data) => {
									if (process.env.CACHE === 'redis') {
										redisclient.set(
											`${p}${e}${found.provider}`,
											data,
											'EX',
											cacheTime * 60
										);
									} else {
										mensaplanCache.push({
											ts: Date.now(),
											content: data,
											key: `${p}${e}${found.provider}`
										});
									}
									resolve(data);
								});
							}
						})
						.catch((e) => {
							reject(e);
						});
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

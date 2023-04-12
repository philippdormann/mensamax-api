require('dotenv').config();
// const request = require('request').defaults({ jar: true });
const cheerio = require('cheerio');
const axios = require('axios').default;
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');
const institutions = require('../institutions.json');
const { writeFileSync } = require('fs');
const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));
// =========
process.env.CACHE_TIME_MINUTES = parseInt(process.env.CACHE_TIME_MINUTES || 1);
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
function getCalendarWeek() {
	Date.prototype.getWeek = function () {
		var date = new Date(this.getTime());
		date.setHours(0, 0, 0, 0);
		// Thursday in current week decides the year.
		date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
		// January 4 is always in week 1.
		var week1 = new Date(date.getFullYear(), 0, 4);
		// Adjust to Thursday in week 1 and count number of weeks from date to week1.
		return (
			1 +
			Math.round(
				((date.getTime() - week1.getTime()) / 86400000 -
					3 +
					((week1.getDay() + 6) % 7)) /
					7
			)
		);
	};
	return new Date().getWeek();
}
// =========
function updateCacheItem(key, data) {
	if (process.env.CACHE === 'redis') {
		redisclient.set(key, data, 'EX', process.env.CACHE_TIME_MINUTES * 60);
	} else {
		mensaplanCache.push({
			ts: Date.now(),
			data,
			key
		});
	}
}
async function getCacheItem(key) {
	return new Promise(async (resolve, reject) => {
		if (process.env.CACHE === 'redis') {
			let cacheItem = await redisclient.get(key);
			if (cacheItem) {
				resolve({ data: cacheItem });
			} else {
				resolve(undefined);
			}
		} else {
			const expiry =
				Date.now() - process.env.CACHE_TIME_MINUTES * 60 * 1000;
			const cacheItem = mensaplanCache.find(
				(i) => i.ts > expiry && i.key === key
			);
			if (cacheItem) {
				resolve(cacheItem);
			} else {
				resolve(undefined);
			}
		}
	});
}
/**
 * @returns {string} (cache-backed) html content of mensaplan
 */
function getMensaPlanHTML({ p, e, kw = getCalendarWeek() }) {
	console.log({ kw });
	return new Promise(async function (resolve, reject) {
		if (p && e) {
			const f = institutions.find(function (ins) {
				return ins.project === p && ins.facility === e;
			});
			if (f) {
				let cache = undefined;
				if (process.env.CACHE !== 'none') {
					cache = await getCacheItem(`${p}_${e}_${f.provider}_${kw}`);
				}
				if (cache) {
					resolve(cache.data);
				} else {
					const d = await fetchHTML({
						p,
						e,
						kw,
						provider: f.provider
					});
					updateCacheItem(`${p}_${e}_${f.provider}_${kw}`, d);
					resolve(d);
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
async function fetchHTML({
	p,
	e,
	provider,
	kw = getCalendarWeek(),
	auth = false,
	nextWeek = false,
	__EVENTVALIDATION = '',
	__VIEWSTATE = '',
	__VIEWSTATEGENERATOR = ''
}) {
	console.log('@@fetchHTML');
	let requestData = undefined;
	let requestMethod = 'GET';
	let url = `https://${provider}/LOGINPLAN.ASPX`;
	if (auth === true) {
		requestData = {
			__VIEWSTATE,
			__EVENTVALIDATION,
			__VIEWSTATEGENERATOR,
			btnLogin: ''
		};
		requestMethod = 'POST';
	}
	if (nextWeek) {
		requestData.btnVor = '>';
		requestData.__EVENTARGUMENT = '';
		requestData.__EVENTTARGET = '';
		url = `https://${provider}/mensamax/Wochenplan/WochenplanExtern/WochenPlanExternForm.aspx`;
	}
	const { data } = await client.request({
		url,
		params: { p, e },
		method: requestMethod,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		data: requestData
	});
	const $ = cheerio.load(data);
	__EVENTVALIDATION = $('#__EVENTVALIDATION').val();
	__VIEWSTATE = $('#__VIEWSTATE').val();
	__VIEWSTATEGENERATOR = $('#__VIEWSTATEGENERATOR').val();
	if (data.includes('btnLogin')) {
		console.log('login performed');
		return await fetchHTML({
			p,
			e,
			provider,
			kw,
			auth: true,
			__EVENTVALIDATION,
			__VIEWSTATE,
			__VIEWSTATEGENERATOR
		});
	}
	//
	var kwText = $('#lblWoche').text();
	console.log({ kwText });
	if (kwText.includes(`(KW${kw})`)) {
		console.log('kw found!');
		// console.log(data);
		return data;
	} else {
		console.log('next week...');
		return await fetchHTML({
			p,
			e,
			provider,
			kw,
			auth: true,
			nextWeek: true,
			__EVENTVALIDATION,
			__VIEWSTATE,
			__VIEWSTATEGENERATOR
		});
	}
}
exports.getMensaPlanHTML = getMensaPlanHTML;
exports.fetchHTML = fetchHTML;

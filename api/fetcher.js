const request = require('request').defaults({ jar: true });
const cheerio = require('cheerio');
const axios = require('axios').default;
const institutions = require('../institutions.json');
// =========
exports.fetcher = ({ p, e }) => {
	return new Promise(function (resolve, reject) {
		if (p && e) {
			const found = institutions.find(function (ins) {
				return ins.project === p && ins.facility === e;
			});
			axios
				.get(`https://${found.provider}/LOGINPLAN.ASPX`, {
					params: { p, e },
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				})
				.then(function (response) {
					const $ = cheerio.load(response.data);
					const __VIEWSTATE = $('#__VIEWSTATE').val();
					const __VIEWSTATEGENERATOR = $(
						'#__VIEWSTATEGENERATOR'
					).val();
					request(
						{
							followAllRedirects: true,
							method: 'POST',
							url: `https://${found.provider}/LOGINPLAN.ASPX`,
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
		} else {
			reject('parameters');
		}
	});
};

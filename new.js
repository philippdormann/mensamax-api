const request = require('request').defaults({ jar: true });
const cheerio = require('cheerio');
const axios = require('axios').default;
// 
const mensaplan_parser = require('./api/mensaplan-parser');
const fs = require('fs');
const { join } = require('path');
let institutions = JSON.parse(
    fs.readFileSync(join(__dirname, `./institutions.json`), 'utf-8')
);
const params = { p: 'FO111', e: 'dts' }
// 
if (params.p && params.e) {
    let found = institutions.find(function (e) {
        return e.project == params.p && e.facility == params.e;
    });
    axios.get('https://mensadigital.de/LOGINPLAN.ASPX', {
        params: { p: 'FO111', e: 'dts' },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then(function (response) {
        const $ = cheerio.load(response.data);
        const __VIEWSTATE = $("#__VIEWSTATE").val();
        const __VIEWSTATEGENERATOR = $("#__VIEWSTATEGENERATOR").val();
        console.log({ __VIEWSTATE, __VIEWSTATEGENERATOR });

        request(
            {
                followAllRedirects: true,
                method: 'POST',
                url: `https://${found.provider}/LOGINPLAN.ASPX`,
                qs: { p: params.p, e: params.e },
                formData: {
                    __VIEWSTATE,
                    __VIEWSTATEGENERATOR,
                    btnLogin: ''
                }
            },
            (error, response, body) => {
                fs.writeFileSync("output_raw.html", body)
                if (error) {
                    console.log(error);
                    return send_it(
                        500,
                        { status: 'fail', payload: error },
                        req,
                        res
                    );
                }
            }
        );
    }).catch(function (error) {
        console.error(error);
    });
} else {
    // TODO: handle missing params: return ../institutions.json ?
}

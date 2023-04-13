# MensaMax-API

### Scraper for MensaMax products (like `mensadigital.de`/ `mensamax.de`/ `mensapoint.de`)

<pre style="text-align:center">
🍲🥘🥡🍛🍜🦐🥔
🍴🍽️ this is just a fancy way of getting some food 🍽️🍴
🍲🥘🥡🍛🍜🦐🥔
</pre>

[![Deployment](https://badgen.net/badge/Deployment/Vercel/black)](https://mensa.vercel.app) [![donate with PayPal](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://paypal.me/philippdormann) [![buy me a coffee](https://img.shields.io/badge/buymeacoffee-donate-yellow.svg)](https://buymeacoffee.com/philippdormann) [![ko-fi](https://badgen.net/badge/ko-fi/donate/yellow)](https://ko-fi.com/V7V4I6I8) [![npm](https://img.shields.io/npm/dy/@philippdormann/mensamax-api?label=npm%20downloads)](https://www.npmjs.com/package/@philippdormann/mensamax-api)

## 🧐 Usage
> General Note: Please use your own caching strategy, MensaMax servers might be quite slow
### API usage
see <https://mensa.vercel.app/institutions-ui> for API URLs

### npm package usage
#### Install package
```bash
pnpm i @philippdormann/mensamax-api
```
#### ts/ module imports
```ts
import { fetchHTML, parser } from '@philippdormann/mensamax-api';
const html = await fetchHTML({ p: 'FO111', e: 'herz', kw: 15 });
const parsed = await parser(html);
console.log(parsed);
```
#### CommonJS imports
```js
const { fetchHTML, parser } = require('@philippdormann/mensamax-api');
(async function () {
	try {
		const html = await fetchHTML({ p: 'FO111', e: 'herz', kw: 15 });
		const parsed = await parser(html);
		console.log(parsed);
	} catch (e) {
		console.log(e);
	}
})();
```

## 🚀 Deployment
This project is deployed as a serverless function on the url <https://mensa.vercel.app> with [Vercel](https://vercel.com/) ☁️

## 🐳 Docker Deployment
This project can be deployed as a docker container.
To do so, just run this code:
```
docker-compose up -d --build
```

## 💻 Local Development
Either develop on your machine directly or use the provided devcontainer for VSCode
```
pnpm i
pnpm dev
```

## 💡 How this works
1. Fetch data from url ([fetcher.js](./api/fetcher.js))
   - fetch `VIEWSTATE` + `VIEWSTATEGENERATOR` from .NET with axios
     - hit login endpoint with a GET request
     - request method: POST
     - enable followAllRedirects
     - set login headers
   - setup request (these settings are important)
     - enable cookies
     - request method: POST
     - enable followAllRedirects
     - set login headers
2. Parsing the data ([parser.js](./api/parser.js))
    - get relevant elements with cheerio
      - timePeriod
      - categories
      - day cards with food items
    - minify html
    - Regex
    - Replace unreadable markup such as internal MensaMax IDs
    - Build JSON from custom markup
3. Serve via rayo http/ Vercel Serverless Function

## 🏫 Known/ tested institutions
- For a nice GUI version, see <https://mensa.vercel.app/institutions-ui>
- For the raw data, see [institutions.json](./institutions.json)
- Please feel free to suggest new institutions by opening a PR/ Issue

## 🧠 General Knowledge
- For some reason, MensaMax IT department decided to have **many URLs**
  - you can find a list of all known MensaMax URLS @[mensamax-urls.txt](./mensa-urls.txt)
- These **URLs are not interchangeable** and seem to be different MensaMax versions (as of 13.04.2023)
- There is a private/ internal GraphQL API for MensaMax which needs authentication

## 👍💰 Support this project
You like this project and would like to give something back?
Thanks! [Have a look at my profile](https://github.com/philippdormann) for more information & options.

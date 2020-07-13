# MensaMax-API

### Scraper for MensaMax products (like `mensadigital.de`/ `mensamax.de`/ `mensapoint.de`)

<pre style="text-align:center">
🍲🥘🥡🍛🍜🦐🥔
🍴🍽️ this is just a fancy way of getting some food 🍽️🍴
🍲🥘🥡🍛🍜🦐🥔
</pre>

## 📚 Dependencies

![Dependency Info](https://img.shields.io/david/philippd1/gymhmensa)
[![Deployment](https://badgen.net/badge/Deployment/Vercel/black)](https://mensa.vercel.app)

-   [express](https://www.npmjs.com/package/express) (minimalist web framework for node)
    -   serve the API via web server
-   [request](https://www.npmjs.com/package/request) (Simplified HTTP client)
    -   make HTTP-requests
-   [cheerio](https://www.npmjs.com/package/cheerio) (core jQuery designed specifically for the server)
    -   simplify scraping the page to a readable format
-   [html-minifier](https://www.npmjs.com/package/html-minifier) (highly configurable, well-tested, JavaScript-based HTML minifier)
    -   remove whitespace, format html to simplify scraping

## 🚀 Deployment
-   this script is deployed as a serverless function on the url <https://mensa.vercel.app> with [Vercel](https://vercel.com/) ☁️
-   the code to this function is found in the `/api` folder 📁

## 🐳 Docker Deployment
This project can be deployed as a docker container.
To do so, just run this code:
```
docker-compose build && docker-compose down --remove-orphans && docker-compose up -d
```

## ❔ HOWTO: local dev with Vercel
-   `npm i -g vercel` / `yarn global add vercel`
-   `vercel dev`

## ❔ HOWTO: run without Vercel (Express Server)
- `npm i && npm run start`
- `yarn && yarn start`

## 🛠️ How this works
1. Fetch data from url (like <https://mensadigital.de/LOGINPLAN.ASPX?P=FO111&E=herz> for example)
    -   setup request (these settings are important)
        -   enable cookies
        -   request method: POST
        -   enable followAllRedirects
        -   set login headers
2. Parsing the data
    -   get relevant element with cheerio
    -   minify html 🗜️
    -   RegEx. a lot of RegEx. 🤯🧠🤯
3. Build JSON - via RegEx 
4. Serve via Express/ Vercel Serverless Function

## 🏫 Known/ tested institutions
- For a nice GUI version, see <https://mensa.vercel.app/institutions-ui>
- For the raw data, see [institutions.json](./institutions.json)

## 🧠 General Knowledge
- For some reason, MensaMax IT department decided to have **many URLs**
  - you can find a list of all known MensaMax URLS @[mensamax-urls.txt](./mensa-urls.txt)
- These **URLs are not interchangable** and seem to be different versions (as of 13.07.2020)

## 👍💰 Support this project
You like this project and would like to give something back?
[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/V7V4I6I8)
<span class="badge-paypal"><a href="https://paypal.me/philippdormann" title="Donate to this project using Paypal"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a></span>
<a href="https://www.buymeacoffee.com/philippdormann" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/lato-orange.png" alt="Buy Me A Coffee" style="height: 40px !important;width: auto !important;" ></a>
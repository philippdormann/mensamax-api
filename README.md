# MensaMax-API

### Scraper for MensaMax products (like `mensadigital.de`/ `mensamax.de`/ `mensapoint.de`)

<pre style="text-align:center">
🍲🥘🥡🍛🍜🦐🥔
🍴🍽️ this is just a fancy way of getting some food 🍽️🍴
🍲🥘🥡🍛🍜🦐🥔
</pre>

## 📚 dependencies

![Dependency Info](https://img.shields.io/david/philippd1/gymhmensa)
[![Deployment](https://badgen.net/badge/Deployment/Vercel/black)](https://mensa.vercel.app)

-   NodeJS
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

## ❔ HOWTO: local dev with Vercel

-   `npm i -g vercel` / `yarn global add vercel`
-   `vercel dev`

## ❔ HOWTO: run this function without Vercel

-   `npm i` / `yarn install`
-   `npm run start` / `yarn start`

## 🛠️ how this works

-   STEP 01: get data from <https://mensadigital.de/LOGINPLAN.ASPX?P=FO111&E=herz>
    -   setup request
        -   enable cookies (`very important`)
        -   request method: POST (`very important`)
        -   enable followAllRedirects (`very important`)
        -   set login headers (`very important`)
-   STEP 02: parse the data
    -   get relevant element with cheerio
    -   minify html
    -   RegEx. a lot of RegEx.
        -   if you really want to, have a look at it yourself - I can't really explain it 🧠🤯🧠
-   STEP 03: JSON
    -   again, done with RegEx.
-   STEP 04: append request info to the JSON
    -   append the request data to the JSON
        -   HTTP-Headers
            -   cache-control
            -   content-type
            -   server
            -   x-aspnet-version
            -   x-powered-by
            -   date
            -   content-length
-   STEP 05 (`optional`): serve via express/ output to file

## 🛠️ development

-   because we don't want to ddos anyone's server, please use `node load-from-server.js` to load the current plan
-   it will create a file `test.html` in the root dir
-   then, use `node parsing.js` for testing with parsing the file `test.html`

## Known institutions
see [institutions.md](./institutions.md)
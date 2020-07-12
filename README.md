# MensaMax-API

### Scraper for MensaMax products (like `mensadigital.de`/ `mensamax.de`/ `mensapoint.de`)

<pre style="text-align:center">
🍲🥘🥡🍛🍜🦐🥔
🍴🍽️ this is just a fancy way of getting some food 🍽️🍴
🍲🥘🥡🍛🍜🦐🥔
</pre>

## 📚 dependencies

![David](https://img.shields.io/david/philippd1/gymhmensa)
[![deployment](https://badgen.net/badge/Deployment/Vercel/black)](https://mensa.vercel.app)

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

| url                                                               | institution name                                 | verified (date) |
| ----------------------------------------------------------------- | ------------------------------------------------ | --------------- |
| https://mensadigital.de/LOGINPLAN.ASPX?P=FO111&E=dts              | "Dr.-Theo-Schöller-Mittelschule in Nürnberg"     | 👎              |
| https://mensadigital.de/LOGINPLAN.ASPX?P=FO111&E=DSK              | "Dreiberg Schule Knetzgau"                       | 👎              |
| https://mensadigital.de/LOGINPLAN.ASPX?P=FO111&E=ghr              | "Georg-Hartmann-Realschule Forchheim"            | 👎              |
| https://mensadigital.de/LOGINPLAN.ASPX?P=FO111&E=hoch             | "Gymnasium Höchstadt a.d.Aisch"                  | 👎              |
| https://mensadigital.de/LOGINPLAN.ASPX?P=FO111&E=herz             | "Gymnasium Herzogenaurach"                       | 👍 (12.07.2020) |
| https://mensadigital.de/LOGINPLAN.ASPX?P=FO111&E=mscadolzburg     | "Mittelschule Cadolzburg"                        | 👎              |
| https://mensadigital.de/LOGINPLAN.ASPX?P=FO111&E=frid             | "Gymnasium Fridericianum"                        | 👎              |
| https://mensadigital.de/LOGINPLAN.ASPX?P=FO111&E=msf              | "Grund und Mittelschule Feucht"                  | 👎              |
| https://mensadigital.de/LOGINPLAN.ASPX?P=FO111&E=feu              | "Realschule Feucht"                              | 👎              |
| https://mensadigital.de/LOGINPLAN.ASPX?P=FO111&E=SLM              | "Mittelschule St. Leonhard Nürnberg"             | 👎              |
| https://mensadigital.de/LOGINPLAN.ASPX?P=FO111&E=gpa              | "Georg-Paul-Amberger Grundschule"                | 👎              |
| https://mensadigital.de/LOGINPLAN.ASPX?P=FO111&E=msf              | "Kinderhort St. Jakob in Feucht "                | 👎              |
| https://mensadigital.de/LOGINPLAN.ASPX?P=FO111&E=Schulhaus        | "Evangelisches Montessori Kinderhaus Röttenbach" | 👎              |
| https://mensadigital.de/LOGINPLAN.ASPX?P=FO111&E=ggo              | "Grundschule Großgründlach"                      | 👎              |
| https://mensadigital.de/LOGINPLAN.ASPX?P=FO111&E=sjw              | "St. Josef Kinderhaus"                           | 👎              |
| https://mensadigital.de/LOGINPLAN.ASPX?P=FO111&E=drb              | "Dientzenhofer Realschule in Brannenburg"        | 👎              |
| https://mensadigital.de/LOGINPLAN.ASPX?P=FO111&E=gsr              | "Graf-Stauffenberg-Realschule in Bamberg"        | 👎              |
| https://mensadigital.de/LOGINPLAN.ASPX?P=FO111&E=lurf             | "Leopold-Ullstein-Realschule Fürth"              | 👎              |
| https://mensadigital.de/LOGINPLAN.ASPX?P=FO111&E=hlg              | "Helene-Lange-Gymnasium in Fürth"                | 👎              |
| https://mensadigital.de/LOGINPLAN.ASPX?P=FO111&E=kat              | "Grund- und Mittelschule Nürnberg-Katzwang"      | 👎              |
| https://mensadigital.de/LOGINPLAN.ASPX?P=FO111&E=sfh              | "St. Franziskus Kinderhaus"                      | 👎              |
| https://mensadigital.de/LOGINPLAN.ASPX?P=FO111&E=GSHerzogenaurach | "Grundschule Herzogenaurach"                     | 👍 (12.07.2020) |
| https://mensapoint.de/LOGINPLAN.ASPX?P=KEH111&E=ggm               | "Gabelsberger-Gymnasium Mainburg"                | 👍 (12.07.2020) |
| https://mensapoint.de/LOGINPLAN.ASPX?P=LL124&E=FWS                | "Freie Waldorfschule Landsberg"                  | 👍 (12.07.2020) |

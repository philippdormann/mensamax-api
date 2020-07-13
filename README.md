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

## 🛠️ how this works
1. Fetch data from url (like <https://mensadigital.de/LOGINPLAN.ASPX?P=FO111&E=herz> for example)
    -   setup request
        -   enable cookies (`very important`)
        -   request method: POST (`very important`)
        -   enable followAllRedirects (`very important`)
        -   set login headers (`very important`)
2. Parsing the data
    -   get relevant element with cheerio
    -   minify html
    -   RegEx. a lot of RegEx.
        -   if you really want to, have a look at it yourself - I can't really explain it 🧠🤯🧠
3. Build JSON
    -   done with RegEx.
4. Serve via Express/ Vercel Serverless

## Known institutions
- For a nice GUI version, see <https://mensa.vercel.app/institutions-ui>
- For the raw data, see [institutions.json](./institutions.json)
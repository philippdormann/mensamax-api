FROM node:18.14.0-alpine3.16
RUN npm i -g pnpm@7
COPY ./ ./
RUN pnpm i --production=true
CMD [ "node", "server.js" ]
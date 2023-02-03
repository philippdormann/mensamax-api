FROM node:18.14.0-alpine3.13
COPY ./ ./
RUN yarn --production=true
CMD [ "node", "server.js" ]
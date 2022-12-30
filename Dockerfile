FROM node:18.12.1-alpine3.13
COPY ./ ./
RUN yarn --production=true
CMD [ "node", "server.js" ]
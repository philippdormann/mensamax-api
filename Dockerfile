FROM node:14.5.0-alpine3.12
COPY ./ ./
RUN yarn install --production=true
CMD [ "node", "server.js" ]
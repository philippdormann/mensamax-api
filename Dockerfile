FROM node:16.3.0-alpine3.13
COPY ./ ./
RUN yarn --production=true --frozen-lockfile
CMD [ "node", "server.js" ]
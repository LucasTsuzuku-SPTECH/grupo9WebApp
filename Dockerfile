FROM node:20-bookworm AS dependencies
WORKDIR /
COPY ./package.json . 
RUN npm install

FROM node:20-alpine AS deploy
WORKDIR / 
COPY --from=dependencies ./node_modules ./node_modules
COPY ./ .
EXPOSE 3333
CMD [ "node", "app.js"]


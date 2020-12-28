FROM node:12.18.1

ENV NODE_ENV=production

WORKDIR /pimp

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

EXPOSE 3000

USER node

CMD [ "node", "server.js" ]
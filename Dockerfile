FROM node:16

ENV NODE_ENV dev
ENV NODE_CONFIG_ENV dev

WORKDIR /usr/src/friend-debts-api-rest
COPY package.json .

RUN npm install

ADD . /usr/src/friend-debts-api-rest

RUN npm run tsc

CMD [ "npm", "start" ]
EXPOSE 1337
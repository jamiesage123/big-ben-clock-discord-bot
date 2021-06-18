FROM node:lts-alpine3.13

WORKDIR /opt/bigben-bot/
COPY . .

RUN npm install

ENV BOT_TOKEN=
ENV DATABASE_URL="postgres://username:password@localhost:5432/database"

CMD BOT_TOKEN=$BOT_TOKEN DATABASE_URL=$DATABASE_URL npm run migrate up && BOT_TOKEN=$BOT_TOKEN DATABASE_URL=$DATABASE_URL npm run start
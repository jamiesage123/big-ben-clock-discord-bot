FROM node:lts-alpine3.13

WORKDIR /opt/bigben-bot/
COPY . .
ENV BOT_TOKEN=
ENV DATABASE_URL="postgres://username:password@localhost:5432/database"

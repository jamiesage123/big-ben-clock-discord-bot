FROM node:lts-alpine3.13

WORKDIR /opt/bigben-bot/
COPY . .
RUN apk update
RUN apk add postgresql
ENV BOT_TOKEN=
ENV DATABASE_URL="postgres://username:password@localhost:5432/database"

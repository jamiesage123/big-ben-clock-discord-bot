FROM node:12.22.1-alpine3.12

WORKDIR /opt/bigben-bot/
COPY . .

# Source https://github.com/Docker-Hub-frolvlad/docker-alpine-python3/blob/master/Dockerfile
RUN apk add --no-cache python3 && \
    if [ ! -e /usr/bin/python ]; then ln -sf python3 /usr/bin/python ; fi && \
    \
    python3 -m ensurepip && \
    rm -r /usr/lib/python*/ensurepip && \
    pip3 install --no-cache --upgrade pip setuptools wheel && \
    if [ ! -e /usr/bin/pip ]; then ln -s pip3 /usr/bin/pip ; fi


RUN apk add --update alpine-sdk
RUN npm install

ENV BOT_TOKEN=
ENV DATABASE_URL=
ENV DATABASE_SECURE=

CMD npm run migrate up && npm run start

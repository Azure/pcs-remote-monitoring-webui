FROM alpine:3.6

MAINTAINER Devis Lucato (https://github.com/dluc)

LABEL Tags="Azure,IoT,Solutions,React,SPA"

COPY ./ /app
WORKDIR /app

RUN apk update && apk upgrade \
 && apk add --no-cache nodejs-npm \
 && npm install \
 && npm run build \
 && rm -rf node_modules src public package.json Dockerfile .dockerignore \
 && apk del --force --purge ncurses-terminfo ncurses-terminfo-base ncurses-libs readline \
 && apk del --force --purge ca-certificates libcrypto1.0 libgcc http-parser libssl1.0 libstdc++ libuv nodejs nodejs-npm \
 && rm -fR /root/.npm /root/.*history /tmp/* \
 && apk add --no-cache nginx \
 && apk del --force --purge alpine-keys apk-tools \
 && rm -rf /var/cache/apk /etc/apk /lib/apk \
 && mkdir /app/logs

EXPOSE 80 443
VOLUME /app/logs

ENTRYPOINT ["/bin/sh", "/app/run.sh"]

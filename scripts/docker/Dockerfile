# Note: multi-stage build, requires Docker 17.05+ (released in May 2017)

FROM node:9.2.0-alpine as codebuilder
COPY ./ /app/
WORKDIR /app
RUN echo "Installing node packages ..." && npm install
RUN echo "Building app..."              && export CI=true && npm run build
RUN echo "Removing temp files..."       && rm -rf node_modules src public package.json Dockerfile .dockerignore


MAINTAINER Devis Lucato (https://github.com/dluc)

LABEL Tags="Azure,IoT,Solutions,React,SPA"

COPY ./ /app
WORKDIR /app

RUN echo "Installing web server..." \
 && apk add --no-cache nginx \
 && mkdir /app/logs \
 && echo "Removing unused files..." \
 && apk del --force --purge alpine-keys apk-tools \
 && rm -rf /var/cache/apk /etc/apk /lib/apk

EXPOSE 80 443
VOLUME /app/logs

ENTRYPOINT ["/bin/sh", "/app/run.sh"]

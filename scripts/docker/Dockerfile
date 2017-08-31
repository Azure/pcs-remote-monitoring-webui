FROM node:6.3.1

COPY ./ /app
WORKDIR /app

RUN \
    apt-get update && \
    apt-get install -y nginx && \
    npm install && \
    npm run build && \
    rm -fR node_modules src public package.json Dockerfile .dockerignore

EXPOSE 80 443

ENTRYPOINT ["/bin/bash", "/app/run.sh"]
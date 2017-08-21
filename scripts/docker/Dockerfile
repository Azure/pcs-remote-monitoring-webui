FROM node:6.3.1

RUN apt-get update && \
    apt-get install -y nginx

COPY . /app
WORKDIR /app

RUN npm install

EXPOSE 80 443

ENTRYPOINT ["/bin/bash", "/app/run.sh"]
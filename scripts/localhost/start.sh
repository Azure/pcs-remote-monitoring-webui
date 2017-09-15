#!/usr/bin/env bash

# Usage:
# * Install nginx
# * Configure the environment variables used in docker-compose.yml
# * Start the React application with `npm start`
# * Run this script
# * Visit http://127.0.0.1:9000

APP_HOME="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && cd .. && cd .. && pwd )/"

cd $APP_HOME

echo "Starting PCS microservices..."
docker-compose -f scripts/localhost/docker-compose.yml up -d --timeout 0

echo "Starting reverse proxy at http://127.0.0.1:9000 ..."
nginx -c $APP_HOME/scripts/localhost/nginx.conf

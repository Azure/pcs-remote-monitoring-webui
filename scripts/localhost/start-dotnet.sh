#!/usr/bin/env bash

# Usage:
# * Install nginx
# * Configure the environment variables used in docker-compose.yml
# * Start the React application with `npm start`
# * Run this script
# * Visit http://127.0.0.1:9000

APP_HOME="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && cd .. && cd .. && pwd )/"

cd $APP_HOME

export PCS_AUTH_REQUIRED=false
export PCS_CORS_WHITELIST="{ 'origins': ['*'], 'methods': ['*'], 'headers': ['*'] }"
export PCS_APPLICATION_SECRET=$(cat /dev/urandom | LC_CTYPE=C tr -dc 'a-zA-Z0-9-,./;:[]\(\)_=^!~' | fold -w 64 | head -n 1)
export PCS_AUTH_AUDIENCE=https://sts.windows.net/00000000-0000-0000-0000-000000000000/
export PCS_AUTH_ISSUER=00000000-0000-0000-0000-000000000000

# Store your development secrets in mysecrets_.sh and make sure you
# don't check it into git history. ".gitignore" should protect from that.
if [ -f "mysecrets_.sh" ]; then
  . mysecrets_.sh
fi

echo "Starting PCS microservices..."
docker-compose -f scripts/localhost/docker-compose.dotnet.yml up -d --timeout 0

echo "Starting reverse proxy at http://127.0.0.1:9000 ..."
nginx -c $APP_HOME/scripts/localhost/nginx.conf

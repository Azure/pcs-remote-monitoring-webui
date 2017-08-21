#!/usr/bin/env bash
set -e
set -x

echo Base Service URL: $REACT_APP_BASE_SERVICE_URL

# build the app and serve it via nginx
npm run build
mkdir -p /app/logs/nginx
nginx -g 'daemon off;' -c /app/nginx.conf

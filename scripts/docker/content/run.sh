#!/usr/bin/env bash
set -e
set -x

# build the app - this adds 1-2 mins to the bootstrap
# this step is required only if there are environment
# variables to inject, which should preferrably be
# fetched from UI config
### echo Base Service URL: $REACT_APP_BASE_SERVICE_URL
### npm run build

# serve the app via nginx
mkdir -p /app/logs
nginx -g 'daemon off;' -c /app/nginx.conf

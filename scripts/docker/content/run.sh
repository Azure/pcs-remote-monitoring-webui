#!/usr/bin/env bash
set -e

# copying webui config
cp /app/public/webui-config.js /app/webui-config.js

# call in current shell.
echo "Creating/Updating web config"
. /app/set_env.sh AUTH authRequired TENANT aadTenantId INSTANCE_URL "-"
cp /app/webui-config.js /app/build/webui-config.js

echo "Starting server"
# serve the app via nginx
mkdir -p /app/logs
nginx -c /app/nginx.conf

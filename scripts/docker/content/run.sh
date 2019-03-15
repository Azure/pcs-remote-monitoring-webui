#!/usr/bin/env bash
set -ex

# call in current shell.
. set_env.sh AUTH authRequired TENANT aadTenantId INSTANCE_URL

# serve the app via nginx
mkdir -p /app/logs
nginx -c /app/nginx.conf

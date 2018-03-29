#!/usr/bin/env bash
set -ex

# serve the app via nginx
mkdir -p /app/logs
nginx -c /app/nginx.conf

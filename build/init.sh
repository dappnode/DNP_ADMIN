#!/bin/sh

# Launch socat in background to allow SSH connections to the host
DOCKER_HOST_IP="172.17.0.1"
socat -v TCP-LISTEN:22,FORK TCP:${DOCKER_HOST_IP}:22 &

# Start nginx
nginx -c /etc/nginx/nginx.conf -g "daemon off;"

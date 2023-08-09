#!/bin/bash

# exit immediately if a command exits with a non-zero status
set -e

# produce failure return code if any command fails in pipe
set -o pipefail

DOCKER_IMAGE=hopprotocol/webhook-server
PORT=4000

docker pull $DOCKER_IMAGE

docker stop webhook_server || true
docker rm webhook_server || true

docker run \
  --name=webhook_server \
  -p $port:9000 \
  --restart=unless-stopped \
  -v ./circleci_webhook_postreceive.sh:/circleci_webhook_postreceive.sh
  $DOCKER_IMAGE gws -port=9000 -method=POST -path=/postreceive -command=/circleci_webhook_postreceive.sh

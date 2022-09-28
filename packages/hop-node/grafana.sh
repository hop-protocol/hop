#!/bin/env bash

docker stop grafana
docker rm grafana

docker run \
  --name grafana \
  -d \
  -v $PWD/grafana-storage:/var/lib/grafana \
  --restart=unless-stopped \
  --net=host \
  -p 3000:3000 \
  grafana/grafana

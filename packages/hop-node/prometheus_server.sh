#!/bin/env bash

docker stop prometheus_server
docker rm prometheus_server

docker run \
  --name prometheus_server \
  --restart=unless-stopped \
  -d \
  -v $PWD/prometheus_server.yml:/etc/prometheus/prometheus.yml \
  -v $PWD/web.yml:/web.yml \
  --net=host \
  -p 9090:9090 \
  prom/prometheus \
  --config.file=/etc/prometheus/prometheus.yml \
  --storage.tsdb.path=/prometheus \
  --web.console.libraries=/usr/share/prometheus/console_libraries \
  --web.console.templates=/usr/share/prometheus/consoles \
  --web.enable-remote-write-receiver \
  --web.config.file=/web.yml

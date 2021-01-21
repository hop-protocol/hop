#!/bin/env bash

cmd=$1
if [[ $cmd = "up" ]]; then
  docker-compose pull
  docker-compose up
fi
if [[ $cmd = "down" ]]; then
  docker-compose down
fi

#!/bin/env bash

DIR_PATH=${DIR_PATH:-$PWD/data}
ROLLUP=${ROLLUP:-0xC34Fd04E698dB75f8381BFA7298e8Ae379bFDA71}
ETH_RPC=${ETH_RPC:-https://kovan.rpc.hop.exchange}
PASS=${PASS:-secret}
DOCKER_IMAGE="874777227511.dkr.ecr.us-east-1.amazonaws.com/arbitrum-validator-setup:latest"

mkdir -p "$DIR_PATH"
sudo chown -R "$USER" "$DIR_PATH"
docker run -v $DIR_PATH:/data $DOCKER_IMAGE initialize.py "$ROLLUP" "$ETH_RPC"
sudo chown -R "$USER" "$DIR_PATH"
docker run -v $DIR_PATH:/data $DOCKER_IMAGE docker_compose.py "$ROLLUP" -p "$PASS"

(
  cd $DIR_PATH && \
  docker-compose up
)

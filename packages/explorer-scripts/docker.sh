#!/bin/env bash

log_group_name="HopExplorerBackend"

docker pull hopprotocol/explorer-backend
docker stop backend
docker rm backend
docker run \
        --name backend \
        --net mynetwork \
        -d \
        -v $PWD/db:/db \
        --log-driver=awslogs \
        --log-opt awslogs-region=us-east-1 \
        --log-opt awslogs-group=$log_group_name \
        --log-opt awslogs-create-group=true \
        --restart=unless-stopped \
        --env-file docker.env \
        -p 80:3000 \
        hopprotocol/explorer-backend start:dist -- --worker --days=3 --offsetDays=0

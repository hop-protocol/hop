#!/bin/env bash

log_group_name="HopExplorerPostgres"

docker stop pg
docker rm pg
docker run \
        -d \
        --name pg \
        --net mynetwork \
        --log-driver=awslogs \
        --log-opt awslogs-region=us-east-1 \
        --log-opt awslogs-group=$log_group_name \
        --log-opt awslogs-create-group=true \
        -p 5432:5432 \
        -v $PWD/pgdata:/var/lib/postgresql/data \
        -e POSTGRES_PASSWORD="$POSTGRES_PASSWORD" \
        postgres

# docker run -it --name=psql --rm --net=mynetwork postgres psql -h pg -U postgres

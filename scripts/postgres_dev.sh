#!/bin/env bash

# docker create network=mynetwork

docker run --net=host --rm --name pg -p 5432:5432 -e POSTGRES_PASSWORD=password postgres

# connect
# docker run -it --rm --net=host postgres psql -h localhost -U postgres

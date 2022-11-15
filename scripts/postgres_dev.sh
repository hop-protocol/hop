#!/bin/env bash

# docker create network=mynetwork

docker run --net=host --rm --name pg -p 5432:5432 -e POSTGRES_PASSWORD=password postgres

# connect
# docker run -it --rm --net=host postgres psql -h localhost -U postgres

#export
#pg.env: PGPASSWORD=
#docker run -it --net=host --env-file pg.env postgres pg_dump -h localhost -U postgres postgres > /tmp/dbdump.sql

#connect from server
#docker run -it --net=host --env-file pg.env postgres psql -h <host> -U postgres postgres

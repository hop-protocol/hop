#!/bin/bash

#rm -rf /tmp/tempdb
# docker create network=mynetwork

docker volume create pgdata

docker run --net=host --rm --name pg -v pgdata:/var/lib/postgresql/data -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:16

# connect
# docker run -it --rm --net=host postgres psql -h localhost -U postgres
# docker exec -it pg psql -h localhost -U postgres

#export
#pg.env: PGPASSWORD=
#docker run -it --net=host --env-file pg.env postgres pg_dump -h localhost -U postgres postgres > /tmp/dbdump.sql

#connect from server
#docker run -it --net=host --env-file pg.env postgres psql -h <host> -U postgres postgres

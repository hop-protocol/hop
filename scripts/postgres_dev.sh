#!/bin/env bash

docker run --rm --name pg -p 5432:5432 -e POSTGRES_PASSWORD=password postgres

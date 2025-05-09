# Metabase

This is the Docker Compose file to run a Metabase instance with a sqlite3 local database.

## Usage

```sh
docker compose up
```

Frontend will be available at [http://localhost:3000](http://localhost:3000)

### Configuration

Update the db locations in `docker-compose.yml` to your local paths.

```sh
    volumes:
    - ./metabase-db:/metabase.db
    - ./db/sqlite3.db:/sqlite3.db
```



# Hop Explorer

> A simple explorer for Hop transfers

## Site URL

[https://explorer.hop.exchange/](https://explorer.hop.exchange/)

## Development

`backend/.env`

```sh
# (required) db connection with default credentials
POSTGRES_USER=postgres
POSTGRES_PASS=password
POSTGRES_DBNAME=postgres
POSTGRES_HOST=localhost

# (required) fill in rpc urls
ETHEREUM_RPC=
GNOSIS_RPC=
POLYGON_RPC=
OPTIMISM_RPC=
ARBITRUM_RPC=
NOVA_RPC=
BASE_RPC=
LINEA_RPC=
```

```sh
# terminal 1
./scripts/postgres_dev.sh

# terminal 2
cd backend && npm run dev:local

# terminal 3
cd frontend && npm run dev:local
```

Visit [http://localhost:3000/](http://localhost:3000/)

### Github Actions

Run github action build locally with [act](https://github.com/nektos/act):

```sh
(cd ../ && act --job build-backend --workflows .github/workflows/backend.yml --secret-file=.secrets --verbose)
```

`.secrets`

```sh
DOCKER_USER=<username>
DOCKER_PASS=<password>
```

## Deployments

Backend docker images are built and pushed to [Docker Hub](https://hub.docker.com/r/hopprotocol/explorer-backend).

| Branch               | Docker Image
| ------------         | -------------------------------------
| `production-backend` | `hopprotocol/explorer-backend:latest`
| `goerli-backend`     | `hopprotocol/explorer-backend:goerli`

Frontend deployments

| Branch               | URL
| ------------         | -------------------------------------
| `production` | https://app.explorer.hop.exchange
| `goerli`     | https://goerli.explorer.hop.exchange

The `develop` branch is the default branch will not perform any deployments.

## License

[MIT](LICENSE)

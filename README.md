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

## License

[MIT](LICENSE)

# Hop Explorer

> A simple explorer for Hop transfers

## Site URL

[https://explorer.hop.exchange/](https://explorer.hop.exchange/)

## Development

`backend/.env`

```sh
POSTGRES_USER=postgres
POSTGRES_PASS=password
POSTGRES_DBNAME=postgres
POSTGRES_HOST=localhost

# fill in
ETHEREUM_RPC=
GNOSIS_RPC=
POLYGON_RPC=
OPTIMISM_RPC=
ARBITRUM_RPC=
NOVA_RPC=
```

```sh
# terminal 1
./scripts/postgres_dev.sh

# terminal 2
cd backend && npm run dev:local

# terminal 3
cd frontend && npm run dev:local
```

## License

[MIT](LICENSE)

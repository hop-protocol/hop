# Hop Explorer Backend

> Backend indexer worker for explorer transfer data pull from the [TheGraph](https://thegraph.com/)

## Development

```sh
npm run dev
```

Serve

```sh
npm start
```

Build

```sh
npm run build
```

Docker build

```sh
make build-docker
```

Env vars

```sh
# (required) db connection
POSTGRES_USER=
POSTGRES_PASS=
POSTGRES_DBNAME=
POSTGRES_HOST=

# (required) rpc urls
NETWORK=mainnet
ETHEREUM_RPC=
GNOSIS_RPC=
POLYGON_RPC=
OPTIMISM_RPC=
ARBITRUM_RPC=
NOVA_RPC=
BASE_RPC=
LINEA_RPC=

# (optional) example
ENABLED_TOKENS=USDC,USDT,DAI,MATIC,ETH,WBTC,HOP,SNX,sUSD,rETH,MAGIC
ENABLED_CHAINS=ethereum,gnosis,polygon,arbitrum,optimism,nova,base,linea
```

### Github Actions

Run github action build locally with [act](https://github.com/nektos/act):

```sh
(cd ../ && act --job build-explorer-backend --workflows .github/workflows/hop_explorer_backend.yml --secret-file=.secrets --verbose)
```

`.secrets`

```sh
DOCKER_USER=<username>
DOCKER_PASS=<password>
```

## Adding new tokens or chains

Update `@hop-protocol/core` version and push. By default all chains and tokens from core package will be enabled.

| Branch               | Docker Image
| ------------         | -------------------------------------
| `production-backend` | `hopprotocol/explorer-backend:latest`
| `goerli-backend`     | `hopprotocol/explorer-backend:goerli`

## API

### GET /v1/transfers

> Returns list of transfers

#### Query params

> All query params are optional and can be combined to filter results.

| Name | Description | Example | Options |
| ---- | ----------- | ------- | ------- |
| `page` | Page | `1` | number |
| `perPage` | Per page | `25` | number from 1-100 |
| `source` | Source chain slug | `ethereum` | `ethereum`, `gnosis`, `polygon`, `optimism`, `arbitrum`, `nova`, `base`, `linea` |
| `destination` | Destination chain slug | `arbitrum` | `ethereum`, `gnosis`, `polygon`, `optimism`, `arbitrum`, `nova`, `base`, `linea` |
| `token` | Token | `USDC` | `USDC`, `USDT`, `DAI`, `MATIC`, `ETH`, `HOP`, `SNX`, `sUSD`, `rETH`, `MAGIC` |
| `bonded` | Bonded status | `true` | `true`, `false` |
| `bonder` | Bonder address | `0x123...` | address |
| `account` | Account address | `0x123...` | address |
| `recipient` | Recipient address | `0x123...` | address |
| `amount` | Amount in units | `100` | number |
| `amountCmp` | Amount comparison | `gt` | `gt`, `lt`, `eq` |
| `amountUsd` | Amount USD | `100` | number |
| `amountUsdCmp` | Amount USD comparison | `gt` | `gt`, `lt`, `eq` |
| `bonderFeeUsd` | Bonder fee USD | `100` | number
| `bonderFeeUsdCmp` | Bonder fee USD comparison | `gt` | `gt`, `lt`, `eq` |
| `transferId` | Transfer ID | `0x123...` | string |
| `startDate` | Start date | `2022-01-01` | string in format YYYY-MM-DD |
| `endDate` | End date | `2022-02-01` | string in format YYYY-MM-DD |
| `startTimestamp` | Start timestamp | `1640995200` | number |
| `endTimestamp` | End timestamp | `1643673600` | number |
| `sortBy` | Sort by | `timestamp` | `timestamp`, `source`, `destination`, `token`, `bonded`, `amount` `amountUsd`, `bonderFee`, `bonderFeeUsd`, `bonder`, `transferId`, `account`, `recipient`, `bondTimestamp`, `bondWithinTimestamp`, `receivedHTokens`, `integrationPartner` |
| `sortDirection` | Sort direction | `desc` | `asc`, `desc` |
| `receivedHTokens` | Received hTokens | `true` | `true`, `false` |

Example queries

```sh
curl "https://explorer-api.hop.exchange/v1/transfers?transferId=0x1abd03ac6b6fe39fba5bfae8673d4ad530fde94bef517ea892abffeb09a35e31"
```

```sh
curl "https://explorer-api.hop.exchange/v1/transfers?source=optimism&destination=arbitrum&token=ETH&amount=20&amountCmp=gt&startDate=2022-01-30&endDate=2022-01-31"
```

Example response

```sh
    {
    "status": "ok",
    "data": [
        {
            "id": "0x1abd03ac6b6fe39fba5bfae8673d4ad530fde94bef517ea892abffeb09a35e31",
            "transferId": "0x1abd03ac6b6fe39fba5bfae8673d4ad530fde94bef517ea892abffeb09a35e31",
            "transactionHash": "0x2e854d1243d68e1741cdc069a995588249627f64c4e6df6c6ab6e79616894054",
            "sourceChainId": 10,
            "destinationChainId": 42161,
            ....
        }
    }]
}
```

## License

[MIT](LICENSE)

# Hop Explorer Backend

> Backend indexer worker for explorer transfer data pull from the [TheGraph](https://thegraph.com/)

Dev

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

# (optional) example
ENABLED_TOKENS=USDC,USDT,DAI,MATIC,ETH,WBTC,HOP,SNX,sUSD,rETH,MAGIC
ENABLED_CHAINS=ethereum,gnosis,polygon,arbitrum,optimism,nova,base
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
| ---- | ----------- | ------- |
| `page` | Page | `1` | 1-100 |
| `perPage` | Per page | `100` | 1-100 |
| `source` | Source chain slug | `ethereum` | `ethereum`, `gnosis`, `polygon`, `optimism`, `arbitrum`, `nova`, `base` |
| `destination` | Destination chain slug | `arbitrum` | `ethereum`, `gnosis`, `polygon`, `optimism`, `arbitrum`, `nova`, `base` |
| `token` | Token | `USDC` | `USDC`, `USDT`, `DAI`, `MATIC`, `ETH`, `WBTC`, `HOP`, `SNX`, `sUSD`, `rETH`, `MAGIC` |
| `bonded` | Bonded status | `true` | `true`, `false` |
| `bonder` | Bonder address | `0x123...` | |
| `account` | Account address | `0x123...` | |
| `recipient` | Recipient address | `0x123...` | |
| `amount` | Amount formatted | `100` | |
| `amountCmp` | Amount formatted comparison | `gt` | `gt`, `lt`, `eq` |
| `amountUsd` | Amount USD | `100` |
| `amountUsdCmp` | Amount USD comparison | `gt` | `gt`, `lt`, `eq` |
| `bonderFeeUsd` | Bonder fee USD | `100` |
| `bonderFeeUsdCmp` | Bonder fee USD comparison | `gt` | `gt`, `lt`, `eq` |
| `transferId` | Transfer ID | `123` | |
| `startDate` | Start date | `2022-01-01` | |
| `endDate` | End date | `2022-02-01` | |
| `startTimestamp` | Start timestamp | `1640995200` | |
| `endTimestamp` | End timestamp | `1643673600` | |
| `sortBy` | Sort by | `timestamp` | `timestamp`, `source`, `destination`, `token`, `bonded`, `amount` `amountUsd`, `bonderFee`, `bonderFeeUsd`, `bonder`, `transferId`, `account`, `recipient`, `bondTimestamp`, `bondWithinTimestamp`, `receivedHTokens`, `integrationPartner` |
| `sortDirection` | Sort direction | `desc` | `asc`, `desc` |
| `receivedHTokens` | Received hTokens | `true` | `true`, `false` |

## License

[MIT](LICENSE)

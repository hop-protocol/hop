# Hop Explorer Backend

> Backend indexer worker for explorer transfer data pull from the [TheGraph](https://thegraph.com/)

Dev

```
npm run dev
```

Serve

```
npm start
```

Build

```
npm run build
```

Docker build

```
make build-docker
```

Env vars

```
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

# (optional) example
ENABLED_TOKENS=USDC,USDT,DAI,MATIC,ETH,WBTC,HOP,SNX,sUSD,rETH,MAGIC
ENABLED_CHAINS=ethereum,gnosis,polygon,arbitrum,optimism,nova,base
```

## License

[MIT](LICENSE)

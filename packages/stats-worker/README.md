# Hop v1 stats worker

> Various stats workers

## Development

Install dependencies

```sh
npm install
```

Build

```sh
npm run build
```

## Running

### Metabase

Run metabase with a sqlite3 local database.

```sh
cd ../metabase
docker-compose up
```

### Workers

Some examples on running workers.

Run all bonder stats workers

```sh
ts-node src/index.ts --bonder --bonderDays=30 --bonderTokens=USDC
```

Run bonder profit stats worker only

```sh
ts-node src/index.ts --bonderProfit --bonderDays=30 --bonderTokens=USDC
```

Run yields worker

```sh
ts-node src/index.ts --yields
```

Run prices worker

```sh
ts-node src/index.ts --prices --pricesPollIntervalSeconds=10
```

Run volume stats worker

```sh
ts-node src/index.ts --volume
```

Run tvl stats worker

```sh
ts-node src/index.ts --tvl --tvlDays=30
```

Run amm stats worker

```sh
ts-node src/index.ts --amm --ammDays=2
```

### Metabase charts

The metabase queries are in the directory [./metabase_queries](./metabase_queries) and can be copied into metabase

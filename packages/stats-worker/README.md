# stats-worker

> Various stats workers

## Development

```sh
npm run build
```

## Running

### Metabase

Run metabase

```sh
cd ../metabase
docker-compose up
```

### Workers

Run all bonder stats workers

```sh
ts-node src/index.ts --bonder --bonderDays=30 --bonderTokens=USDC
```

Run bonder profit stats worker only

```sh
ts-node src/index.ts --bonderProfit --bonderDays=30 --bonderTokens=USDC
```

Run apr worker

```sh
ts-node src/index.ts --apr
```

Run volume worker

```sh
ts-node src/index.ts --volume --days=30
```

Run tvl worker

```sh
ts-node src/index.ts --tvl --days=30
```

### Metabase charts

The metabase queries are in the directory [./metabase_queries](./metabase_queries) and can be copied into metabase

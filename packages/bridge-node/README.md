# bridge node

> L1<>L2 Bridge node

## Getting started

Run bridge node watcher:

```bash
docker run --env-file .env 874777227511.dkr.ecr.us-east-1.amazonaws.com/authereum/bridge-node:latest
```

Bridge node config:

```bash
COMMITTEE_PRIVATE_KEY=0x111...
```

Run arbitrum node:

```bash
DIR_PATH=~/arbitrum ./l2_nodes/arbitrum/setup.sh
```

## Development

Install dependencies:

```bash
npm install
```

Run node:

```bash
npm start
```

Run E2E example:

```bash
npm run example
```

## License

[MIT](LICENSE)

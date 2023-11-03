# v1 Hop Node

> Hop node for bonding transfers

⚠️ Hop node is in beta. Use at your own risk.

## Documentation

See [docs.hop.exchange/hop-node](https://docs.hop.exchange/hop-node)

## Development

Install dependencies

```sh
npm install
```

Build node

```sh
npm run build
```

Run node; for complete instructions and required config, see [https://docs.hop.exchange/v/developer-docs/hop-node/running-a-hop-bonder](https://docs.hop.exchange/v/developer-docs/hop-node/running-a-hop-bonder).

```sh
npm start
```

## Deployments

Docker images are built and pushed to [Docker Hub](https://hub.docker.com/r/hopprotocol/hop-node).

| Branch              | Docker Image                   | Release  | Description                                 |
| ------------        | -------------------------------| -------- | ------------------------------------------- |
| `production-bonder` | `hopprotocol/hop-node:latest`  | Stable   | Production mainnet environment              |
| `mainnet-bonder`    | `hopprotocol/hop-node:mainnet` | Beta     | Mainnet pre-release environment             |
| `develop-bonder`    | `hopprotocol/hop-node:develop` | Unstable | Unstable mainnet staging environment        |
| `goerli-bonder`     | `hopprotocol/hop-node:goerli`  | Stable   | Goerli staging environment                  |

## License

[MIT](LICENSE)

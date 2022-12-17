# v1 Hop Node

> Hop node for bonding transfers

⚠️ Hop node is in beta. Use at your own risk.

## Documentation

See [docs.hop.exchange/hop-node](https://docs.hop.exchange/hop-node)

## Development

Install dependencies

```bash
yarn install
```

Run node

```bash
yarn start
```

## Deployments

| Branch              | Docker Image                   | Release  | Description                                 |
| ------------        | -------------------------------| -------- | ------------------------------------------- |
| `production-bonder` | `hopprotocol/hop-node:latest`  | Stable   | Production mainnet environment              |
| `mainnet-bonder`    | `hopprotocol/hop-node:mainnet` | Beta     | Mainnet pre-release environment             |
| `staging-bonder`    | `hopprotocol/hop-node:staging` | Alpha    | Stable mainnet staging environment          |
| `develop-bonder`    | `hopprotocol/hop-node:develop` | Unstable | Unstable mainnet staging environment        |
| `kovan-bonder`      | `hopprotocol/hop-node:kovan`   | Stable   | Kovan staging environment                   |
| `goerli-bonder`     | `hopprotocol/hop-node:goerli`  | Stable   | Goerli staging environment                  |
| `rinkeby-bonder`    | `hopprotocol/hop-node:rinkeby` | Stable   | Rinkeby staging environment                 |

## License

[MIT](LICENSE)

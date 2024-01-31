# v1 Hop Node

> Hop node for bonding transfers

⚠️ Hop node is in beta. Use at your own risk.

## Documentation

See [docs.hop.exchange/hop-node](https://docs.hop.exchange/hop-node)

## Development

Pull the `hop` monorepo and install dependencies using `pnpm`. 

```sh
# Install the dependencies
pnpm install

# Build the required files
pnpm build

# Run the client
pnpm --filter @hop-protocol/hop-node dev
```

For complete instructions and required config, see [https://docs.hop.exchange/v/developer-docs/hop-node/running-a-hop-bonder](https://docs.hop.exchange/v/developer-docs/hop-node/running-a-hop-bonder).

## Deployments

Docker images are built and pushed to [Docker Hub](https://hub.docker.com/r/hopprotocol/hop-node).

| Branch              | Docker Image                   | Release  | Description                                 |
| ------------        | -------------------------------| -------- | ------------------------------------------- |
| `production-bonder` | `hopprotocol/hop-node:latest`  | Stable   | Production mainnet environment              |
| `mainnet-bonder`    | `hopprotocol/hop-node:mainnet` | Beta     | Mainnet pre-release environment             |
| `develop-bonder`    | `hopprotocol/hop-node:develop` | Unstable | Unstable mainnet staging environment        |
| `goerli-bonder`     | `hopprotocol/hop-node:goerli`  | Stable   | Goerli staging environment                  |

Run github action build locally with [act](https://github.com/nektos/act):

```sh
(cd ../../ && act --job build-hop-node --workflows .github/workflows/hop_node.yml --secret-file=.secrets --verbose)
```

`.secrets`

```sh
DOCKER_USER=<username>
DOCKER_PASS=<password>
```

## License

[MIT](LICENSE)

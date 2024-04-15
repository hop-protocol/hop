# v1 Hop Node

> V1 Hop Node for bonding transfers

> [!NOTE]
> This package is only meant to be used by other Hop Node packages. We recommend installing one of the Hop Node packages if you want access to functionality in this package.

## Documentation

See the [Hop docs site](https://docs.hop.exchange/v/developer-docs)

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

### Github Actions

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

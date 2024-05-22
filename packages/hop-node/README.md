# v1 Hop Node

> V1 Hop Node for bonding transfers

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
pnpm --filter hop-node dev
```

For complete instructions and required config, see [https://docs.hop.exchange/v/developer-docs/hop-node/running-a-hop-bonder](https://docs.hop.exchange/v/developer-docs/hop-node/running-a-hop-bonder).

## Deployments

Docker images are built and pushed to [Docker Hub](https://hub.docker.com/r/hopprotocol/hop-node).

| Branch              | Docker Image                   | Release  | Description                                 |
| ------------        | -------------------------------| -------- | ------------------------------------------- |
| `production-bonder` | `hopprotocol/hop-node:latest`  | Stable   | Production mainnet environment              |
| `mainnet-bonder`    | `hopprotocol/hop-node:mainnet` | Beta     | Mainnet pre-release environment             |
| `develop-bonder`    | `hopprotocol/hop-node:develop` | Unstable | Unstable mainnet staging environment        |


## License

[MIT](LICENSE)

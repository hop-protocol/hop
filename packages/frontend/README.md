# Hop v1 UI

> The UI for [Hop Protocol](https://hop.exchange/)

## Getting started

Install dependencies:

```sh
pnpm install
```

Start app (uses `mainnet` network by default):

```sh
pnpm dev
```

Start app using a different network (e.g. `mainnet`, `goerli`)

```sh
REACT_APP_NETWORK=mainnet npm run dev
```

Visit [https://localhost:3000/](https://localhost:3000/)

Environment variables can be set in a `.env` file, for example:

```sh
PUBLIC_URL=.
REACT_APP_IPFS_BUILD=true
REACT_APP_ENABLED_CHAINS=ethereum,polygon,gnosis,optimism,arbitrum
REACT_APP_ENABLED_TOKENS=ETH,USDC,USDT,DAI
REACT_APP_NETWORK=goerli
```

To disable certain routes, use this environment variable, for example this disables gnosis→anyDestination anyToken route and optimism→arbitrum USDC route:

```sh
REACT_APP_DISABLED_ROUTES=gnosis:all:all,optimism:arbitrum:USDC
```

Build distribution build:

```sh
pnpm build
```

Run github action build locally with [act](https://github.com/nektos/act):

```sh
(cd ../../ && act --workflows .github/workflows/debug.yml)
```

Make sure to set `if: true` in `debug.yml` first.

## Deployments

| Branch       | Network | URL                                                  | Release  | Description                                 |
| ------------ | ------- | ---------------------------------------------------- | -------- | ------------------------------------------- |
| `production` | mainnet | [app.hop.exchange](https://app.hop.exchange)         | Stable   | Production mainnet environment              |
| `mainnet`    | mainnet | [mainnet.hop.exchange](https://mainnet.hop.exchange) | Beta     | Mainnet pre-release environment             |
| `preprod`    | mainnet | [preprod.hop.exchange](https://preprod.hop.exchange) | Beta     | Alternative mainnet pre-release environment |
| `develop`    | mainnet | [dev.hop.exchange](https://dev.hop.exchange)         | Unstable | Unstable mainnet staging environment        |
| `goerli`     | kovan   | [goerli.hop.exchange](https://goerli.hop.exchange)   | Stable   | Goerli staging environment                  |

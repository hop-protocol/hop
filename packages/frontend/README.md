# Hop v1 UI

> The UI for [Hop Protocol](https://hop.exchange/)

## Getting started

Install dependencies:

```bash
yarn install
```

Lerna link:

```bash
npx lerna link
```

Start app (uses `kovan` network by default):

```bash
yarn run dev
```

Start app using a different network (e.g. `mainnet`, `goerli`, `kovan`)

```bash
REACT_APP_NETWORK=mainnet yarn run dev
```

Visit [https://localhost:3000/](https://localhost:3000/)

## Deployments

| Branch       | Network | URL                                                  | Release  | Description                                 |
| ------------ | ------- | ---------------------------------------------------- | -------- | ------------------------------------------- |
| `production` | mainnet | [hop.exchange](https://hop.exchange)                 | Stable   | Production mainnet environment              |
| `mainnet`    | mainnet | [mainnet.hop.exchange](https://mainnet.hop.exchange) | Beta     | Mainnet pre-release environment             |
| `preprod`    | mainnet | [preprod.hop.exchange](https://preprod.hop.exchange) | Beta     | Alternative mainnet pre-release environment |
| `staging`    | mainnet | [staging.hop.exchange](https://staging.hop.exchange) | Alpha    | Stable mainnet staging environment          |
| `develop`    | mainnet | [dev.hop.exchange](https://dev.hop.exchange)         | Unstable | Unstable mainnet staging environment        |
| `kovan`      | kovan   | [kovan.hop.exchange](https://kovan.hop.exchange)     | Stable   | Alternative kovan staging environment       |
| `goerli`     | kovan   | [goerli.hop.exchange](https://goerli.hop.exchange)   | Stable   | Goerli staging environment                  |
| `synth`      | kovan   | [synth.hop.exchange](https://synth.hop.exchange)     | Stable   | Synthetix kovan demo                        |

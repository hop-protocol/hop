# Hop UI

> The UI for [Hop Protocol](https://hop.exchange/)

## Getting started

Install dependencies:

```bash
npm install
```

Start app (uses `kovan` network by default):

```bash
npm run dev
```

Start app using a different network (e.g. `mainnet`, `goerli`, `kovan`)

```bash
REACT_APP_NETWORK=mainnet npm run dev
```

Visit [https://localhost:3000/](https://localhost:3000/)

## Deployments

| Branch       | Network | URL                                                  | Release | Description                                 |
| ------------ | ------- | ---------------------------------------------------- | ------- | ------------------------------------------- |
| `production` | mainnet | [hop.exchange](https://hop.exchange)                 | Stable  | Production mainnet environment              |
| `mainnet`    | mainnet | [mainnet.hop.exchange](https://mainnet.hop.exchange) | Alpha   | Mainnet pre-release environment             |
| `preprod`    | mainnet | [preprod.hop.exchange](https://preprod.hop.exchange) | Alpha   | Alternative mainnet pre-release environment |
| `staging`    | kovan   | [staging.hop.exchange](https://staging.hop.exchange) | Stable  | Stable kovan staging environment            |
| `develop`    | kovan   | [dev.hop.exchange](https://dev.hop.exchange)         | Alpha   | Unstable kovan staging environment          |
| `kovan`      | kovan   | [kovan.hop.exchange](https://kovan.hop.exchange)     | Stable  | Alternative kovan staging environment       |
| `goerli`     | kovan   | [goerli.hop.exchange](https://goerli.hop.exchange)   | Stable  | Goerli staging environment                  |
| `synth`      | kovan   | [synth.hop.exchange](https://synth.hop.exchange)     | Stable  | Synthetix kovan demo                        |

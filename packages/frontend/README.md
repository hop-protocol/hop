# Hop v1 UI

> The UI for [Hop Protocol](https://hop.exchange/)

## Getting started

Install dependencies:

```bash
npm install
```

Lerna link:

```bash
npx lerna link
```

Start app (uses `mainnet` network by default):

```bash
npm run dev
```

Start app using a different network (e.g. `mainnet`, `goerli`)

```bash
REACT_APP_NETWORK=mainnet npm run dev
```

Visit [https://localhost:3000/](https://localhost:3000/)

## Deployments

| Branch       | Network | URL                                                  | Release  | Description                                 |
| ------------ | ------- | ---------------------------------------------------- | -------- | ------------------------------------------- |
| `production` | mainnet | [app.hop.exchange](https://app.hop.exchange)         | Stable   | Production mainnet environment              |
| `mainnet`    | mainnet | [mainnet.hop.exchange](https://mainnet.hop.exchange) | Beta     | Mainnet pre-release environment             |
| `preprod`    | mainnet | [preprod.hop.exchange](https://preprod.hop.exchange) | Beta     | Alternative mainnet pre-release environment |
| `staging`    | mainnet | [staging.hop.exchange](https://staging.hop.exchange) | Alpha    | Stable mainnet staging environment          |
| `develop`    | mainnet | [dev.hop.exchange](https://dev.hop.exchange)         | Unstable | Unstable mainnet staging environment        |
| `goerli`     | kovan   | [goerli.hop.exchange](https://goerli.hop.exchange)   | Stable   | Goerli staging environment                  |
| `kovan`      | kovan   | [kovan.hop.exchange](https://kovan.hop.exchange)     | Stable   | Kovan staging environment (deprecated) |

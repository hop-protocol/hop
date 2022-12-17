# Hop v1 Monorepo

> The [Hop Protocol](https://hop.exchange/) v1 monorepo

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

## Packages

| Library                                                       | Current Version                                                                                                                                   | Description                                 |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| [@hop-protocol/core](packages/core)                             | [![npm version](https://badge.fury.io/js/%40hop-protocol%2Fcore.svg)](https://badge.fury.io/js/)                                                   | Metadata and config                         |
| [@hop-protocol/sdk](packages/sdk)                             | [![npm version](https://badge.fury.io/js/%40hop-protocol%2Fsdk.svg)](https://badge.fury.io/js/)                                                   | TypeScript Hop SDK                          |


| Application                                                   | Current Version                                                                                                                                   | Description                                 |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| [@hop-protocol/frontend](packages/frontend)                   | [![npm version](https://badge.fury.io/js/%40hop-protocol%2Ffrontend.svg)](https://badge.fury.io/js/%40hop-protocol%2Ffrontend)                    | React Frontend UI                           |
| [@hop-protocol/hop-node](packages/hop-node)                   | [![npm version](https://badge.fury.io/js/%40hop-protocol%2Fhop-node.svg)](https://badge.fury.io/js/%40hop-protocol%2Fhop-node)                    | TypeScript Hop Node                         |

## Quickstart

Install dependencies & link packages

    yarn install
    yarn run bootstrap

Run frontend app in development

    cd packages/frontend
    REACT_APP_NETWORK=mainnet yarn run dev

Visit [http://localhost:3000/](http://localhost:3000/)

## Contributing

See [./CONTRIBUTING.md](./CONTRIBUTING.md)

## License

[MIT](LICENSE)

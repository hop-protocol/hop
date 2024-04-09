# Hop v1 SDK

> The Hop Protocol JavaScript SDK

[![Documentation](https://img.shields.io/badge/documentation-available-green.svg?style=flat)](https://docs.hop.exchange/v/developer-docs/js-sdk/js-sdk)
[![License](http://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/@hop-protocol/sdk/master/LICENSE)
[![dependencies Status](https://david-dm.org/@hop-protocol/sdk/status.svg)](https://david-dm.org/@hop-protocol/sdk)
[![NPM version](https://badge.fury.io/js/%40hop-protocol%2Fsdk.svg)](https://badge.fury.io/js/%40hop-protocol%2Fsdk)
[![npm bundle size (scoped version)](https://img.shields.io/bundlephobia/minzip/@hop-protocol/sdk/latest.svg)](https://bundlephobia.com/result?p=@hop-protocol/sdk@latest)

## Demo

[https://sdk-demo.hop.exchange/](https://sdk-demo.hop.exchange/)

## Install

```bash
npm install @hop-protocol/sdk
```

## CDN

[https://cdn.jsdelivr.net/npm/@hop-protocol/sdk@latest/hop.js](jsDelivr CDN)

```html
<script src="https://cdn.jsdelivr.net/npm/@hop-protocol/sdk@latest/hop.js"></script>
```

[https://unpkg.com/@hop-protocol/sdk@latest/hop.js](unpkg CDN)

```html
<script src="https://unpkg.com/@hop-protocol/sdk@latest/hop.js"></script>
```

## Documentation

For getting started and examples, see [docs.hop.exchange/v/developer-docs/js-sdk/js-sdk](https://docs.hop.exchange/v/developer-docs/js-sdk/js-sdk)

For sdk API reference, see [hop-sdk-docs.netlify.app](https://hop-sdk-docs.netlify.app/)

## Development

Install dependencies

```bash
npm install
```

Run build watcher

```bash
npm run dev
```

Build sdk

```bash
npm run build
```

Generate documentation

```bash
npm run docs
```

Run github action build locally with [act](https://github.com/nektos/act):

```sh
(cd ../../ && act --job publish-sdk --workflows .github/workflows/npm_publish_sdk.yml --secret-file=.secrets --verbose)
```

## Test

```bash
npm test
```

## Adding New Contracts

The logic to create a new entry in the `contract/` module requires a deprecated version of `typechain` that does not work well with modern tooling. This logic has been moved out of this repository and new contracts should be created out of band and copied here.

The ABI file should be a simple JSON file with only the contract ABI ([example](https://github.com/hop-protocol/hop/blob/ab7aa0f4f3d678c1c0ea3e5a6767917d9456ca24/packages/sdk-core/src/abi/generated/ERC20.json)).

```bash
# Create contracts
npm i -g typechain@8.1.0 && npm i -g @typechain/ethers-v5@10.1.0
typechain --target=ethers-v5 --out-dir=<OUT_DIR> <ABI_FILE>.json

# Update imports at <OUT_DIR>/<CONTRACT>.ts. Add `.js` to the `from "./common"` import
from "./common.js"

# Update imports at <OUT_DIR>/factories/<CONTRACT>__factory.ts. Add `.js` to the `from "./<CONTRACT>"` import
from "../<CONTRACT>.js"

# Move relevant files
mv <OUT_DIR>/<CONTRACT>.ts <SDK_DIR>/src/contracts/
mv <OUT_DIR>/factories/<CONTRACT>__factory.ts <SDK_DIR>/src/contracts/factories

# Add to SDK contracts exports at <SDK_DIR>/src/contracts/index.ts
export type { <CONTRACT> } from "./<CONTRACT>.js"
export { <CONTRACT>__factory } from "./<CONTRACT>__factory.js"

# Add to SDK contract factories exports at <SDK_DIR>/src/contracts/factories/index.ts
export { <CONTRACT>__factory } from "./<CONTRACT>__factory.js"
```

typechain --target=ethers-v5 --out-dir=./output ./ERC20.json



## License

[MIT](LICENSE)

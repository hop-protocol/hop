# Hop SDK Core

> This code is shared across Hop TypeScript SDKs.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://raw.githubusercontent.com/@hop-protocol/sdk-core/master/LICENSE)
[![NPM version](https://badge.fury.io/js/%40hop-protocol%2Fsdk-core.svg)](https://badge.fury.io/js/@hop-protocol%2Fsdk-core.svg)

> [!NOTE]
> This package is only meant to be used by the Hop TypeScript SDKs. We recommend installing one of the Hop SDKs if you want access to functionality in this package.

## Development

Install dependencies

```bash
pnpm install
```

Build sdk

```bash
pnpm build
```

Run github action build locally with [act](https://github.com/nektos/act):

```sh
(cd ../../ && act --job publish-sdk --workflows .github/workflows/npm_publish_sdk.yml --secret-file=.secrets --verbose)
```

## Test

```bash
pnpm test
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

## License

[MIT](LICENSE)

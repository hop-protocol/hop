# @hop-protocol/core

> Hop Protocol config and metadata

## Addresses

```js
import * as addresses from '@hop-protocol/core/addresses'

console.log(addresses.goerli.USDC.ethereum.l1Bridge)) // 0x123...
```

See the following files for list of available addresses

- [./src/addresses/mainnet.ts](./src/addresses/mainnet.ts)
- [./src/addresses/goerli.ts](./src/addresses/goerli.ts)

## Networks

```js
import * as networks from '@hop-protocol/core/networks'

console.log(networks.mainnet.gnosis.rpcUrls[0]) // "https://rpc.gnosischain.com/"
```

See the following files for available configuration info

- [./src/networks/mainnet.ts](./src/networks/mainnet.ts)
- [./src/networks/goerli.ts](./src/networks/goerli.ts)

## ABIs

```js
import { L1BridgeAbi } from '@hop-protocol/core/abi'

console.log(L1BridgeAbi)) // [...]
```

See [src/abi/index.ts](./src/abi/index.ts) for list of available ABIs

## Metadata

```js
import * as metadata from '@hop-protocol/core/metadata'

console.log(metadata.mainnet.tokens.USDC.decimals)) // 6
```

- See [src/metadata/tokens.ts](./src/metadata/tokens.ts) for available token metadata
- See [src/metadata/chains.ts](./src/metadata/chains.ts) for available chain metadata

## Development

Install dependencies

```sh
npm install
```

Watch

```sh
npm run dev
```

Build

```sh
npm run build
```

Run github action build locally with [act](https://github.com/nektos/act):

```sh
(cd ../../ && act --job publish-core --workflows .github/workflows/npm_publish_core.yml --secret-file=.secrets --verbose)
```

## License

[MIT](LICENSE)

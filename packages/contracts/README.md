# `contracts`

> TODO: description

## Usage

```
const contracts = require('contracts');

// TODO: DEMONSTRATE API
```

## Addresses

### Arbitrum

#### L1

_Pre Deployed_
* L1 DAI (Pool Token): `0x7d669A64deb8a4A51eEa755bb0E19FD39CE25Ae9`
* L1 Messenger: `0xE681857DEfE8b454244e701BA63EfAa078d7eA85`

_Bridge System_
* L1 Bridge: `0xC9898E162b6a43dc665B033F1EF6b2bc7B0157B4`
* L1 Bridge Wrapper: `0xb5cAC377180fcE007664Cc65ff044d685e0F1A3b`


#### L2

_Pre Deployed_
* L2 DAI (oDAI): `0x7d669a64deb8a4a51eea755bb0e19fd39ce25ae9`
* L2 Messenger: `0x0000000000000000000000000000000000000064`

_Bridge System_
* L2 Bridge: `0xf8E96392b1Ba3B2FD88041894a93e089E93C0dcd`
* L2 Uniswap Factory: `0xEaAec7a29B6ccE9e831C8d07e989fa4163026177`
* L2 Uniswap Router: `0xBae19197DFa25105E832b8fAfeAB88aCa275385F`

## Scripts

### Deploy and setup arbitrum

* npx hardhat run scripts/arbitrum/deployArbitrumL1.ts --network kovan
* npx hardhat run scripts/arbitrum/deployArbitrumL2.ts --network arbitrum
* npx hardhat run scripts/arbitrum/setupArbitrumL1.ts --network kovan
* npx hardhat run scripts/arbitrum/setupArbitrumL2.ts --network arbitrum

## FAQ

* What are the relevant `messageId`s?

    * Arbitrum = `0x9186606d55c571b43a756333453d90ab5653c483deb4980cda697bfa36fba5de`
      Optimism = `0x09d0f27659ee556a8134fa56941e42400e672aecc2d4cfc61cdb0fcea4590e05`
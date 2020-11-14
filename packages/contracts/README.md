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
* L1 Canonical Bridge: `0xE681857DEfE8b454244e701BA63EfAa078d7eA85`

_Bridge System_
* L1 Bridge: `0x1652a11C406d6Ea407967370B492f85BeCE96c29`
* L1 Bridge Wrapper: `0xaE254AC0EA0aA32bBdEb207C1F58e1bA98F0cF26`


#### L2

_Pre Deployed_
* L2 DAI (oDAI): `0x7d669a64deb8a4a51eea755bb0e19fd39ce25ae9`
* L2 Canonical Bridge: `0xDc08a1D8b62f02F55149D51F68504412fdF2Ce3c`

_Bridge System_
* L2 Bridge: `0xFbf9AB2A295a7c6f01f667C4fd326Df20bEa30e3`
* L2 Uniswap Factory: `0xe98f0E5522B44191A101BDd4aD9B247ffEd94a2d`
* L2 Uniswap Router: `0x958F7a85E32e948Db30F7332ee809ED26B43298a`

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
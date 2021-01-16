# `contracts`

> TODO: description

## Usage

```
const contracts = require('contracts');

// TODO: DEMONSTRATE API
```

## Contract Addresses

### Arbitrum Testnet 3

| Contract Name | Network | Hop Protocol Contract | Address |
|---|---|---|---|
| L1 DAI               | Kovan              | No  | [`0x7d669A64deb8a4A51eEa755bb0E19FD39CE25Ae9`](https://kovan.etherscan.io/address/0x7d669A64deb8a4A51eEa755bb0E19FD39CE25Ae9)
| L1 Messenger         | Kovan              | No  | [`0xE681857DEfE8b454244e701BA63EfAa078d7eA85`](https://kovan.etherscan.io/address/0xE681857DEfE8b454244e701BA63EfAa078d7eA85)
| L1 Bridge            | Kovan              | Yes | [`0xe74EFb19BBC46DbE28b7BaB1F14af6eB7158B4BE`](https://kovan.etherscan.io/address/0xe74EFb19BBC46DbE28b7BaB1F14af6eB7158B4BE)
| L1 Messenger Wrapper | Kovan              | Yes | [`0x36501dcD0007aA4DB373667d730C5AE91a7b3cc8`](https://kovan.etherscan.io/address/0x36501dcD0007aA4DB373667d730C5AE91a7b3cc8)
| L2 DAI               | Arbitrum Testnet 3 | No  | [`0x7d669A64deb8a4A51eEa755bb0E19FD39CE25Ae9`](https://explorer.offchainlabs.com/#/address/0x7d669A64deb8a4A51eEa755bb0E19FD39CE25Ae9)
| L2 Messenger         | Arbitrum Testnet 3 | No  | [`0x0000000000000000000000000000000000000064`](https://explorer.offchainlabs.com/#/address/0x0000000000000000000000000000000000000064)
| L2 Bridge            | Arbitrum Testnet 3 | Yes | [`0xf3af9B1Edc17c1FcA2b85dd64595F914fE2D3Dde`](https://explorer.offchainlabs.com/#/address/0xf3af9B1Edc17c1FcA2b85dd64595F914fE2D3Dde)
| L2 Uniswap Factory   | Arbitrum Testnet 3 | Yes | [`0xd28B241aB439220b85b8B90B912799DefECA8CCe`](https://explorer.offchainlabs.com/#/address/0xd28B241aB439220b85b8B90B912799DefECA8CCe)
| L2 Uniswap Router    | Arbitrum Testnet 3 | Yes | [`0x2B6812d2282CF676044cBdE2D0222c08e6E1bdb2`](https://explorer.offchainlabs.com/#/address/0x2B6812d2282CF676044cBdE2D0222c08e6E1bdb2)
| L2 Uniswap Exchange  | Arbitrum Testnet 3 | Yes | [`0xD637bf04dF4FDFDf951C06e3c87f7801c85b161f`](https://explorer.offchainlabs.com/#/address/0xD637bf04dF4FDFDf951C06e3c87f7801c85b161f)

### Arbitrum Testnet 2

| Contract Name | Network | Hop Protocol Contract | Address |
|---|---|---|---|
| L1 DAI               | Kovan              | No  | [`0x7d669A64deb8a4A51eEa755bb0E19FD39CE25Ae9`](https://kovan.etherscan.io/address/0x7d669A64deb8a4A51eEa755bb0E19FD39CE25Ae9)
| L1 Messenger         | Kovan              | No  | [`0xE681857DEfE8b454244e701BA63EfAa078d7eA85`](https://kovan.etherscan.io/address/0xE681857DEfE8b454244e701BA63EfAa078d7eA85)
| L1 Bridge            | Kovan              | Yes | [`0xC9898E162b6a43dc665B033F1EF6b2bc7B0157B4`](https://kovan.etherscan.io/address/0xC9898E162b6a43dc665B033F1EF6b2bc7B0157B4)
| L1 Messenger Wrapper | Kovan              | Yes | [`0xb5cAC377180fcE007664Cc65ff044d685e0F1A3b`](https://kovan.etherscan.io/address/0xb5cAC377180fcE007664Cc65ff044d685e0F1A3b)
| L2 DAI               | Arbitrum Testnet 3 | No  | [`0x7d669A64deb8a4A51eEa755bb0E19FD39CE25Ae9`](https://explorer.offchainlabs.com/#/address/0x7d669A64deb8a4A51eEa755bb0E19FD39CE25Ae9)
| L2 Messenger         | Arbitrum Testnet 3 | No  | [`0x0000000000000000000000000000000000000064`](https://explorer.offchainlabs.com/#/address/0x0000000000000000000000000000000000000064)
| L2 Bridge            | Arbitrum Testnet 3 | Yes | [`0xf8E96392b1Ba3B2FD88041894a93e089E93C0dcd`](https://explorer.offchainlabs.com/#/address/0xf8E96392b1Ba3B2FD88041894a93e089E93C0dcd)
| L2 Uniswap Factory   | Arbitrum Testnet 3 | Yes | [`0xEaAec7a29B6ccE9e831C8d07e989fa4163026177`](https://explorer.offchainlabs.com/#/address/0xEaAec7a29B6ccE9e831C8d07e989fa4163026177)
| L2 Uniswap Router    | Arbitrum Testnet 3 | Yes | [`0xBae19197DFa25105E832b8fAfeAB88aCa275385F`](https://explorer.offchainlabs.com/#/address/0xBae19197DFa25105E832b8fAfeAB88aCa275385F)
| L2 Uniswap Exchange  | Arbitrum Testnet 3 | Yes | [`0xea535dF09be62d5542161D1a4A429A831d329638`](https://explorer.offchainlabs.com/#/address/0xea535dF09be62d5542161D1a4A429A831d329638)

## Scripts

### Deploy and setup arbitrum

* npx hardhat run scripts/arbitrum/deployArbitrumL1.ts --network kovan
* npx hardhat run scripts/arbitrum/deployArbitrumL2.ts --network arbitrum
* npx hardhat run scripts/arbitrum/setupArbitrumL1.ts --network kovan
* npx hardhat run scripts/arbitrum/setupArbitrumL2.ts --network arbitrum

## Definitions
* **Transfer** - The data for a transfer from one chain to another.
* **TransferHash** - The hash of a single transfer's data.
* **TransferRoot** - The merkle root of a tree of TransferHashes and associated metadata such as the destination chainIds and totals for each chain.
* **Bridge** - A hop bridge contracts on L1 or L2 ("L1 Bridge", "Hop Bridge", "Arbitrum Bridge", "Optimism Bridge")
* **Canonical Token Bridge** - A Rollup's own token bridge. ("Canonical Arbitrum Bridge", "Canonical Optimism Bridge")

#### Tokens

* **Canonical L1 Token** - The layer 1 token that is being bridged.
  ("Canonical L1 ETH", "Canonical L1 DAI", "DAI", "ETH")
* **hToken** - Exists on L2 and represents the right to 1 Token deposited in the L1 bridge.
  hToken's can be converted to their Canonical L1 Token or vice versa at a 1:1 rate.
  ("hDAI", "hETH")
* **Canonical L2 Token** - The primary L2 representation of a Canonical L1 Token. This is the
  token you get from depositing into a rollup's Canonical Token Bridge.

#### Token Path
On Hop, tokens are always converted along the following path. To convert DAI to Arbitrum DAI, DAI (on L1) is first converted to hDAI (on L2) using the L1 Hop Bridge. Then the hDAI is swapped for Arbitrum DAI through the Uniswap market. This can be done in one transaction by calling `sendToL2AndAttemptSwap`.

```
      Layer 1          |      Layer 2
                       |
Canonical L1 Token <---|---> hToken <--(Uniswap)--> Canonical L2 Token
                       |
```

e.g.

```
      Layer 1          |      Layer 2
                       |
DAI <--------------<---|---> hDAI <----(Uniswap)--> Arbitrum DAI
                       |
```

## Steps to Integrate a New L2

The following steps are to add a new L2 (Xyz, for example) to the Hop System:

* Contract updates
  * Add the Xyz messenger interface in `./contracts/interfaces/xyz/messengers/IXyz.sol`
  * Add a wrapper for the Xyz messenger in `./contracts/wrappers/XyzMessengerWrapper.sol`
  * Add messenger logic for Xyz to the L1 mock messenger in `./contracts/test/L1_MockMessenger.sol`
  * Add messenger logic for Xyz to the L2 mock messenger in `./contracts/test/L2_MockMessenger.sol`
  * Add an L2 Bridge for Xyz to `./contracts/bridges/L2_XyzBridge.sol`
  * Add a mock L2 Bridge for Xyz to `./contracts/test/Mock_L2_XyzBridge.sol`

* Testing updates
  * Add Xyz to `L2_NAMES` in `./test/shared/constants.ts`
  * Add `XYZ_CHAIN_ID` in `./test/shared/constants.ts`
  * Add Xyz contract artifacts to `getL2SpecificArtifact()` in `./test/shared/fixtures.ts`
  * Add Xyz to `getChainIdFromName()` in `./test/shared/utils.ts`
  * Add `setXyzMessengerWrapperDefaults()` to `./test/shared/utils.ts`
  * Add Xyz to `setMessengerWrapperDefaults()` in `./test/shared/utils.ts`

* Config updates
  * Add the L2 and its URL to `./hardhat.config.ts`

* Other updates
  * If necessary, write a script to deploy the contracts on Xyz chain in `./scripts/deployment/Xyz`


## FAQ

* What are the relevant `messageId`s?

    * Arbitrum = `0x9186606d55c571b43a756333453d90ab5653c483deb4980cda697bfa36fba5de`
      Optimism = `0x09d0f27659ee556a8134fa56941e42400e672aecc2d4cfc61cdb0fcea4590e05`
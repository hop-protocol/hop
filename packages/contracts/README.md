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
L1 Pool Token: 0x7d669A64deb8a4A51eEa755bb0E19FD39CE25Ae9
Global inbox: 0xE681857DEfE8b454244e701BA63EfAa078d7eA85

L1 Bridge: 0x1652a11C406d6Ea407967370B492f85BeCE96c29
L1 Messenger: 0x7b542e47Bf4aeC075cC2a3bB1871890AAfB0D5d9
L1 Messenger Wrapper: 0xaE254AC0EA0aA32bBdEb207C1F58e1bA98F0cF26


#### L2

L2 Messenger: 
L2 Bridge:
L2 Uniswap Factory: 
L2 Uniswap Router: 

## Scripts

### Deploy and setup arbitrum

* npx hardhat run scripts/arbitrum/deployArbitrumL1.ts --network kovan
* npx hardhat run scripts/arbitrum/deployArbitrumL2.ts --network arbitrum
* npx hardhat run scripts/arbitrum/setupArbitrumL1.ts --network kovan
* npx hardhat run scripts/arbitrum/setupArbitrumL2.ts --network arbitrum

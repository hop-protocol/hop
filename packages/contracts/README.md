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
L1 Pool Token: 0xE8d447130bA14Bc76A8bBf29b18196C70d762255
L1 Bridge: 0x570bd01C0f64521968093e47A83A5fD819A6a4a6
L1 Messenger: 0x8aca015FAA06F22bE661D04Aa3606DAbDB0Aaf64
L1 Messenger Wrapper: 0xe3F62e3c2f454720423ad4d8E76632358749387D

Global inbox: 0xE681857DEfE8b454244e701BA63EfAa078d7eA85

#### L2

L2 Messenger: 0xd888161Cf0651f50d9BbfaA7DE2A8F50609B6437
L2 Bridge: 0x1e5FC4836e7d177200C61e757B5aAb0a699fc98e
L2 Uniswap Factory: 0xa6C618A22f6D310a58b52a5c22eC368BacE86274
WETH: 0xAA26622a744c81BF10e05658b252AFB8EC6AcA82
L2 Uniswap Router: 0xFF18474af898eAf467182140721D7725cbD041C4

## Scripts

### Deploy and setup arbitrum

* npx hardhat run scripts/arbitrum/deployArbitrumL1.ts --network kovan
* npx hardhat run scripts/arbitrum/deployArbitrumL2.ts --network arbitrum
* npx hardhat run scripts/arbitrum/setupArbitrumL1.ts --network kovan
* npx hardhat run scripts/arbitrum/setupArbitrumL2.ts --network arbitrum

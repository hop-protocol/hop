import { Addresses } from './types.js'

export const addresses: Addresses = {
  '11155111': {
    chainId: '11155111',
    startBlock: 6595867,
    hubCoreMessenger: '0x0FcB53Fd9363f186eaB2Eb6a18f3a5d360058981', // dispatcher
    spokeCoreMessenger: '0x0FcB53Fd9363f186eaB2Eb6a18f3a5d360058981', // dispatcher
    ethFeeDistributor: '',
    railsGateway: '0x3791ed182b54e4DBB2522E97A86bC5a7c0cE8D6A',
    dispatcher: '0x0FcB53Fd9363f186eaB2Eb6a18f3a5d360058981',
    transporter: '0x01B4344Da9Ef2b6bB7e7Ab884f67fac5c8E0867D',
    executor: '0xAf262b960BFD4Ba18fd034DDA93C895E85060e6F',
    tokens: {
      MOCK: '0x73bd27b5DB0815979bBCEb1Da519DECeF9F74Baf',
      USDC: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'
    }
  },
  '11155420': {
    chainId: '11155420',
    startBlock: 16580185,
    spokeCoreMessenger: '0x602F50D1ED4EaD69B3FCeB08f7925f2Dbe0379CE', // dispatcher
    railsGateway: '0xff958F932c618dF1C11bD29f2ea95d718f893188',
    dispatcher: '0x602F50D1ED4EaD69B3FCeB08f7925f2Dbe0379CE',
    transporter: '0x60351EA76A7bD55734200Ae1b6532a46dbb03F08',
    executor: '0xfE07e38411873C9A2E95A1E8C6736cd5Bf45C06D',
    tokens: {
      MOCK: '0x73bd27b5DB0815979bBCEb1Da519DECeF9F74Baf',
      USDC: '0x036CbD53842c5426634e7929541eC2318f3dCF7e'
    }
  },
  '84532': {
    chainId: '84532',
    startBlock: 14597343,
    spokeCoreMessenger: '0x0FcB53Fd9363f186eaB2Eb6a18f3a5d360058981', // dispatcher
    railsGateway: '0x3791ed182b54e4DBB2522E97A86bC5a7c0cE8D6A',
    dispatcher: '0x0FcB53Fd9363f186eaB2Eb6a18f3a5d360058981',
    transporter: '0x01B4344Da9Ef2b6bB7e7Ab884f67fac5c8E0867D',
    executor: '0xAf262b960BFD4Ba18fd034DDA93C895E85060e6F',
    tokens: {
      MOCK: '0x73bd27b5DB0815979bBCEb1Da519DECeF9F74Baf',
      USDC: '0x036CbD53842c5426634e7929541eC2318f3dCF7e'
    }
  },
  '42069': {
    chainId: '42069',
    startBlock: 43581,
    spokeCoreMessenger: '0x0FcB53Fd9363f186eaB2Eb6a18f3a5d360058981', // dispatcher
    railsGateway: '0x3791ed182b54e4DBB2522E97A86bC5a7c0cE8D6A',
    dispatcher: '0x0FcB53Fd9363f186eaB2Eb6a18f3a5d360058981',
    transporter: '0x01B4344Da9Ef2b6bB7e7Ab884f67fac5c8E0867D',
    executor: '0xAf262b960BFD4Ba18fd034DDA93C895E85060e6F',
    tokens: {
      MOCK: '0x73bd27b5DB0815979bBCEb1Da519DECeF9F74Baf',
      USDC: '0x36d3f5501Ef2BA0ea329c46C5A4a463C163e1ff0'
    }
  }
}

 // Contracts for chain 11155111
 //  transporter 0x01B4344Da9Ef2b6bB7e7Ab884f67fac5c8E0867D
 //  dispatcher 0x0FcB53Fd9363f186eaB2Eb6a18f3a5d360058981
 //  executor 0xAf262b960BFD4Ba18fd034DDA93C895E85060e6F
 //  gateway 0x3791ed182b54e4DBB2522E97A86bC5a7c0cE8D6A
 //  MOCK 0x73bd27b5DB0815979bBCEb1Da519DECeF9F74Baf
 //  USDC 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238

 //  Contracts for chain 42069
 //  transporter 0x01B4344Da9Ef2b6bB7e7Ab884f67fac5c8E0867D
 //  dispatcher 0x0FcB53Fd9363f186eaB2Eb6a18f3a5d360058981
 //  executor 0xAf262b960BFD4Ba18fd034DDA93C895E85060e6F
 //  gateway 0x3791ed182b54e4DBB2522E97A86bC5a7c0cE8D6A
 //  MOCK 0x73bd27b5DB0815979bBCEb1Da519DECeF9F74Baf
 //  USDC 0x36d3f5501Ef2BA0ea329c46C5A4a463C163e1ff0

 //  Contracts for chain 11155420
 //  transporter 0x60351EA76A7bD55734200Ae1b6532a46dbb03F08
 //  dispatcher 0x602F50D1ED4EaD69B3FCeB08f7925f2Dbe0379CE
 //  executor 0xfE07e38411873C9A2E95A1E8C6736cd5Bf45C06D
 //  gateway 0xff958F932c618dF1C11bD29f2ea95d718f893188
 //  MOCK 0xF41c455212D8f34d2D824Acd18E6bcadEDe8097F
 //  USDC 0x5fd84259d66Cd46123540766Be93DFE6D43130D7

 //  Contracts for chain 84532
 //  transporter 0x01B4344Da9Ef2b6bB7e7Ab884f67fac5c8E0867D
 //  dispatcher 0x0FcB53Fd9363f186eaB2Eb6a18f3a5d360058981
 //  executor 0xAf262b960BFD4Ba18fd034DDA93C895E85060e6F
 //  gateway 0x3791ed182b54e4DBB2522E97A86bC5a7c0cE8D6A
 //  MOCK 0x73bd27b5DB0815979bBCEb1Da519DECeF9F74Baf
 //  USDC 0x036CbD53842c5426634e7929541eC2318f3dCF7e

 //  Path Ids for chain 11155420
 //  Note: Only paths with the Hop Hub matter if everything is routed through there. Paths directly between spoke chains are possible too but not listed below.

 //  MOCK 11155420 <> 11155111 0xa8167c6ab0510e925fd0dd0644e493a5b03d466bea809b0dbd322f8997a519c7
 //  MOCK 11155420 <> 42069    0x8c863ff2b41f497dc7d8e63a6a5dee606b6ba45611c532516d74cfabe0ea7aa6
 //  MOCK 11155420 <> 84532    0xc3846f21279a0efb6b7108618b65d81dd9ded9b59424fc435644c8a6cc289846
 //  USDC 11155420 <> 11155111 0x5895972a67d33d1353fcbad8d01857b643af149611407bbe06e0e3682ed217c5
 //  USDC 11155420 <> 42069    0x7f2c99d2fa20872d5b41d1a9dfefc10ebaa09645cd20264e7fd35851d8337465
 //  USDC 11155420 <> 84532    0x8e051c70431a2c93eee3074c3624ed01335d4e4b8f78f1cd5ae1f398d0ba6660

// https://github.com/hop-protocol/contracts-v2-private/blob/master/test/foundry/HopHubSimulation.t.sol#L440

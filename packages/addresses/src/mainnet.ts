import { Addresses } from './types'

export const addresses: Addresses = {
  bonders: ['0x2A6303e6b99d451Df3566068EBb110708335658f'],
  bridges: {
    USDC: {
      ethereum: {
        l1CanonicalToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        l1Bridge: '0x774502B60385065E16ffe1342F8a699a751585e9'
      },
      xdai: {
        l1CanonicalBridge: '0x88ad09518695c6c3712AC10a214bE5109a655671',
        l1MessengerWrapper: '0x652a38FA87f60A122AEF360eEeFcaf6258eDdF6A',
        l2CanonicalBridge: '0xf6A78083ca3e2a662D6dd1703c939c8aCE2e268d',
        l2CanonicalToken: '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83',
        l2Bridge: '0xa50395bdEaca7062255109fedE012eFE63d6D402',
        l2HopBridgeToken: '0xCB4cEeFce514B2d910d3ac529076D18e3aDD3775',
        l2AmmWrapper: '0x652a38FA87f60A122AEF360eEeFcaf6258eDdF6A',
        l2SaddleSwap: '0xF7C52d88A1D39966C22F9e07A61f43f61eC1eF1d',
        l2SaddleLpToken: '0x45F098635FBFcC0e373e87d515CdaE7Bc56Ec86D',
        l1Amb: '0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e',
        l2Amb: '0x75Df5AF045d91108662D8080fD1FEFAd6aA0bb59',
        canonicalBridgeMaxPerTx: '1000000000'
      },
      polygon: {
        l1CanonicalBridge: '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77',
        l1MessengerWrapper: '0xCbb852A6274e03fA00fb4895dE0463f66dF27a11',
        l2CanonicalBridge: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        l2CanonicalToken: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        l2Bridge: '0xCbb852A6274e03fA00fb4895dE0463f66dF27a11',
        l2HopBridgeToken: '0xDc38c5aF436B9652225f92c370A011C673FA7Ba5',
        l2AmmWrapper: '0xC8A4FB931e8D77df8497790381CA7d228E68a41b',
        l2SaddleSwap: '0x2935173357c010F8B56c8719a44f9FbdDa90f67c',
        l2SaddleLpToken: '0x7689674c3EcEC55086b08A3cEA785de2848d8C87',
        l1PosRootChainManager: '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77',
        l1PosPredicate: '0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf',
        l1FxBaseRootTunnel: '0xfe5e5D361b2ad62c541bAb87C45a0B9B018389a2'
      }
    }
  }
}

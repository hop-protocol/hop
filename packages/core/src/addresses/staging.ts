import { Addresses } from './types'

export const addresses: Addresses = {
  bonders: {
    USDC: ['0xad103c0928aCfde91Dfd4E9E21225bcf9c7cbE62'],
    MATIC: ['0xd8781ca9163e9f132a4d8392332e64115688013a']
  },
  bridges: {
    USDC: {
      ethereum: {
        l1CanonicalToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        l1Bridge: '0x72209Fe68386b37A40d6bCA04f78356fd342491f',
        bridgeDeployedBlockNumber: 12820652
      },
      xdai: {
        l1CanonicalBridge: '0x88ad09518695c6c3712AC10a214bE5109a655671',
        l1MessengerWrapper: '0x5C32143C8B198F392d01f8446b754c181224ac26',
        l2CanonicalBridge: '0xf6A78083ca3e2a662D6dd1703c939c8aCE2e268d',
        l2CanonicalToken: '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83',
        l2Bridge: '0x46ae9BaB8CEA96610807a275EBD36f8e916b5C61',
        l2HopBridgeToken: '0x74fa978EaFFa312bC92e76dF40FcC1bFE7637Aeb',
        l2AmmWrapper: '0x7D269D3E0d61A05a0bA976b7DBF8805bF844AF3F',
        l2SaddleSwap: '0x022C5cE6F1Add7423268D41e08Df521D5527C2A0',
        l2SaddleLpToken: '0x3b507422EBe64440f03BCbE5EEe4bdF76517f320',
        l1Amb: '0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e',
        l2Amb: '0x75Df5AF045d91108662D8080fD1FEFAd6aA0bb59',
        canonicalBridgeMaxPerTx: 1000000000,
        bridgeDeployedBlockNumber: 17055334
      },
      polygon: {
        l1CanonicalBridge: '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77',
        l1MessengerWrapper: '0x3c0FFAca566fCcfD9Cc95139FEF6CBA143795963',
        l2CanonicalBridge: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        l2CanonicalToken: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        l2Bridge: '0xe28EA9254a9A433EC4E92227c498A1CeAD8210C2',
        l2HopBridgeToken: '0xe7F40BF16AB09f4a6906Ac2CAA4094aD2dA48Cc2',
        l2AmmWrapper: '0xCb5DDFb8D0038247Dc0bEeeCAa7f3457bEFcb77c',
        l2SaddleSwap: '0x4AD8db323F6EBEC4DEb53140FfC7dDb22DE5f607',
        l2SaddleLpToken: '0xC37fA2448eb8ddd54e50D11D9fF4b82F1D01d7Dc',
        l1FxBaseRootTunnel: '0x3c0FFAca566fCcfD9Cc95139FEF6CBA143795963',
        l1PosRootChainManager: '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77',
        l1PosPredicate: '0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf',
        bridgeDeployedBlockNumber: 16828103
      }
    }
  }
}

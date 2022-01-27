import { Addresses } from './types'

export const addresses: Addresses = {
  bonders: {
    USDC: {
      ethereum: {
        optimism: '0xad103c0928aCfde91Dfd4E9E21225bcf9c7cbE62',
        arbitrum: '0xad103c0928aCfde91Dfd4E9E21225bcf9c7cbE62',
        gnosis: '0xad103c0928aCfde91Dfd4E9E21225bcf9c7cbE62',
        polygon: '0xad103c0928aCfde91Dfd4E9E21225bcf9c7cbE62'
      },
      optimism: {
        ethereum: '0xad103c0928aCfde91Dfd4E9E21225bcf9c7cbE62',
        arbitrum: '0xad103c0928aCfde91Dfd4E9E21225bcf9c7cbE62',
        gnosis: '0xad103c0928aCfde91Dfd4E9E21225bcf9c7cbE62',
        polygon: '0xad103c0928aCfde91Dfd4E9E21225bcf9c7cbE62'
      },
      arbitrum: {
        ethereum: '0xad103c0928aCfde91Dfd4E9E21225bcf9c7cbE62',
        optimism: '0xad103c0928aCfde91Dfd4E9E21225bcf9c7cbE62',
        gnosis: '0xad103c0928aCfde91Dfd4E9E21225bcf9c7cbE62',
        polygon: '0xad103c0928aCfde91Dfd4E9E21225bcf9c7cbE62'
      },
      gnosis: {
        ethereum: '0xad103c0928aCfde91Dfd4E9E21225bcf9c7cbE62',
        arbitrum: '0xad103c0928aCfde91Dfd4E9E21225bcf9c7cbE62',
        optimism: '0xad103c0928aCfde91Dfd4E9E21225bcf9c7cbE62',
        polygon: '0xad103c0928aCfde91Dfd4E9E21225bcf9c7cbE62'
      },
      polygon: {
        ethereum: '0xad103c0928aCfde91Dfd4E9E21225bcf9c7cbE62',
        arbitrum: '0xad103c0928aCfde91Dfd4E9E21225bcf9c7cbE62',
        gnosis: '0xad103c0928aCfde91Dfd4E9E21225bcf9c7cbE62',
        optimism: '0xad103c0928aCfde91Dfd4E9E21225bcf9c7cbE62'
      }
    }
  },
  bridges: {
    USDC: {
      ethereum: {
        l1CanonicalToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        l1Bridge: '0x72209Fe68386b37A40d6bCA04f78356fd342491f',
        bridgeDeployedBlockNumber: 12820652
      },
      gnosis: {
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
        bridgeDeployedBlockNumber: 17055334
      },
      polygon: {
        l1CanonicalBridge: '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77',
        l1MessengerWrapper: '0x7A08f1409E5D3e9Bc49063aA4009fB4BBC8777C3',
        l2CanonicalBridge: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        l2CanonicalToken: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        l2Bridge: '0xe28EA9254a9A433EC4E92227c498A1CeAD8210C2',
        l2HopBridgeToken: '0xe7F40BF16AB09f4a6906Ac2CAA4094aD2dA48Cc2',
        l2AmmWrapper: '0xCb5DDFb8D0038247Dc0bEeeCAa7f3457bEFcb77c',
        l2SaddleSwap: '0x4AD8db323F6EBEC4DEb53140FfC7dDb22DE5f607',
        l2SaddleLpToken: '0xC37fA2448eb8ddd54e50D11D9fF4b82F1D01d7Dc',
        l1FxBaseRootTunnel: '0x7A08f1409E5D3e9Bc49063aA4009fB4BBC8777C3',
        l1PosRootChainManager: '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77',
        l1PosPredicate: '0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf',
        bridgeDeployedBlockNumber: 16828103
      },
      optimism: {
        l1CanonicalBridge: '0x0000000000000000000000000000000000000000',
        l1MessengerWrapper: '0x99F68f7819e0ee731fEB1486c7652E3740aE63DC',
        l2CanonicalBridge: '0x4200000000000000000000000000000000000010',
        l2CanonicalToken: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
        l2Bridge: '0xe22D2beDb3Eca35E6397e0C6D62857094aA26F52',
        l2HopBridgeToken: '0x3666f603Cc164936C1b87e207F36BEBa4AC5f18a',
        l2AmmWrapper: '0x9dA925EBE0e341D06C7074856F49d46866d83762',
        l2SaddleSwap: '0x0e0E3d2C5c292161999474247956EF542caBF8dd',
        l2SaddleLpToken: '0x5Da345C942cf804b306D552d343F92b69160b5Df',
        bridgeDeployedBlockNumber: 760156
      },
      arbitrum: {
        l1CanonicalBridge: '0x0000000000000000000000000000000000000000',
        l1MessengerWrapper: '0xF86c14f015AcFb14a88C0d3eB51b51e4637ABa3c',
        l2CanonicalBridge: '0x0000000000000000000000000000000000000000',
        l2CanonicalToken: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
        l2Bridge: '0xCB4cEeFce514B2d910d3ac529076D18e3aDD3775',
        l2HopBridgeToken: '0x774502B60385065E16ffe1342F8a699a751585e9',
        l2AmmWrapper: '0xCbb852A6274e03fA00fb4895dE0463f66dF27a11',
        l2SaddleSwap: '0xb87ac009f61fa214f196e232fd14a6f8ae422fa1',
        l2SaddleLpToken: '0x6Ad03376a15819c80b267038E2E4c00D35Cf8f67',
        bridgeDeployedBlockNumber: 260713
      }
    }
  }
}

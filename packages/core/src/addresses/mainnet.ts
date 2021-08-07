import { Addresses } from './types'

export const addresses: Addresses = {
  bonders: {
    USDC: ['0xa6a688F107851131F0E1dce493EbBebFAf99203e'],
    USDT: ['0xa6a688F107851131F0E1dce493EbBebFAf99203e']
  },
  bridges: {
    USDC: {
      ethereum: {
        l1CanonicalToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        l1Bridge: '0x3666f603Cc164936C1b87e207F36BEBa4AC5f18a',
        bridgeDeployedBlockNumber: 12650032
      },
      xdai: {
        l1CanonicalBridge: '0x88ad09518695c6c3712AC10a214bE5109a655671',
        l1MessengerWrapper: '0x12e59C59D282D2C00f3166915BED6DC2F5e2B5C7',
        l2CanonicalBridge: '0xf6A78083ca3e2a662D6dd1703c939c8aCE2e268d',
        l2CanonicalToken: '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83',
        l2Bridge: '0x25D8039bB044dC227f741a9e381CA4cEAE2E6aE8',
        l2HopBridgeToken: '0x9ec9551d4A1a1593b0ee8124D98590CC71b3B09D',
        l2AmmWrapper: '0x76b22b8C1079A44F1211D867D68b1eda76a635A7',
        l2SaddleSwap: '0x5C32143C8B198F392d01f8446b754c181224ac26',
        l2SaddleLpToken: '0x9D373d22FD091d7f9A6649EB067557cc12Fb1A0A',
        l1Amb: '0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e',
        l2Amb: '0x75Df5AF045d91108662D8080fD1FEFAd6aA0bb59',
        canonicalBridgeMaxPerTx: 1000000000,
        bridgeDeployedBlockNumber: 16617211
      },
      polygon: {
        l1CanonicalBridge: '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77',
        l1MessengerWrapper: '0x10541b07d8Ad2647Dc6cD67abd4c03575dade261',
        l2CanonicalBridge: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        l2CanonicalToken: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        l2Bridge: '0x25D8039bB044dC227f741a9e381CA4cEAE2E6aE8',
        l2HopBridgeToken: '0x9ec9551d4A1a1593b0ee8124D98590CC71b3B09D',
        l2AmmWrapper: '0x76b22b8C1079A44F1211D867D68b1eda76a635A7',
        l2SaddleSwap: '0x5C32143C8B198F392d01f8446b754c181224ac26',
        l2SaddleLpToken: '0x9D373d22FD091d7f9A6649EB067557cc12Fb1A0A',
        l1FxBaseRootTunnel: '0x10541b07d8Ad2647Dc6cD67abd4c03575dade261',
        l1PosRootChainManager: '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77',
        l1PosPredicate: '0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf',
        bridgeDeployedBlockNumber: 15810014
      }
    },
    USDT: {
      ethereum: {
        l1CanonicalToken: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        l1Bridge: '0x3E4a3a4796d16c0Cd582C382691998f7c06420B6',
        bridgeDeployedBlockNumber: 12860139
      },
      xdai: {
        l1CanonicalBridge: '0x88ad09518695c6c3712AC10a214bE5109a655671',
        l1MessengerWrapper: '0xC08055b634D43F2176d721E26A3428D3b7E7DdB5',
        l2CanonicalBridge: '0xf6A78083ca3e2a662D6dd1703c939c8aCE2e268d',
        l2CanonicalToken: '0x4ECaBa5870353805a9F068101A40E0f32ed605C6',
        l2Bridge: '0xFD5a186A7e8453Eb867A360526c5d987A00ACaC2',
        l2HopBridgeToken: '0x91f8490eC27cbB1b2FaEdd29c2eC23011d7355FB',
        l2AmmWrapper: '0x49094a1B3463c4e2E82ca41b8e6A023bdd6E222f',
        l2SaddleSwap: '0x3Aa637D6853f1d9A9354FE4301Ab852A88b237e7',
        l2SaddleLpToken: '0x5b10222f2Ada260AAf6C6fC274bd5810AF9d33c0',
        l1Amb: '0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e',
        l2Amb: '0x75Df5AF045d91108662D8080fD1FEFAd6aA0bb59',
        canonicalBridgeMaxPerTx: 1000000000,
        bridgeDeployedBlockNumber: 17155195
      },
      polygon: {
        l1CanonicalBridge: '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77',
        l1MessengerWrapper: '0xe7C1D08aC706444F356af2D37541d8d57e8C57B6',
        l2CanonicalBridge: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        l2CanonicalToken: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        l2Bridge: '0x6c9a1ACF73bd85463A46B0AFc076FBdf602b690B',
        l2HopBridgeToken: '0x9F93ACA246F457916E49Ec923B8ed099e313f763',
        l2AmmWrapper: '0x8741Ba6225A6BF91f9D73531A98A89807857a2B3',
        l2SaddleSwap: '0xB2f7d27B21a69a033f85C42d5EB079043BAadC81',
        l2SaddleLpToken: '0x3cA3218D6c52B640B0857cc19b69Aa9427BC842C',
        l1FxBaseRootTunnel: '0xe7C1D08aC706444F356af2D37541d8d57e8C57B6',
        l1PosRootChainManager: '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77',
        l1PosPredicate: '0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf',
        bridgeDeployedBlockNumber: 17058878
      }
    }
  }
}

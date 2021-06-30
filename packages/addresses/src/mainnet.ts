import { Addresses } from './types'

export const addresses: Addresses = {
  bonders: ['0xa6a688f107851131f0e1dce493ebbebfaf99203e'],
  bridges: {
    USDC: {
      ethereum: {
        l1CanonicalToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        l1Bridge: '0x3666f603Cc164936C1b87e207F36BEBa4AC5f18a'
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
        canonicalBridgeMaxPerTx: '1000000000'
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
        l1PosPredicate: '0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf'
      }
    }
  }
}

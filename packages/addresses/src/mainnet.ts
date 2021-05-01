import { Addresses } from './types'

export const addresses: Addresses = {
  USDC: {
    ethereum: {
      l1CanonicalToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      l1Bridge: '0x81F9f9dF3CC73e40dC28B0cbE5C443C8327c4a25'
    },
    xdai: {
      l1CanonicalBridge: '0x88ad09518695c6c3712AC10a214bE5109a655671',
      l1MessengerWrapper: '',
      l2CanonicalBridge: '0xf6A78083ca3e2a662D6dd1703c939c8aCE2e268d',
      l2CanonicalToken: '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83',
      l2Bridge: '0xF7fC69223fc2D9800FF3592292234c58964c7fA6',
      l2HopBridgeToken: '0x207339b272446a749B137CEBb3f53A1aED38632c',
      l2AmmWrapper: '0xA5A959A6104950498023E78B4C175247Fc50311D',
      l2SaddleSwap: '0x7Dc708DA532fBAf0bE20fDeC98ae78A2F22a42D0',
      l2SaddleLpToken: '0xea8ACa5661B2865D27459dcbF1413ccd6fB1C56C',
      l1Amb: '0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e',
      l2Amb: '0x75Df5AF045d91108662D8080fD1FEFAd6aA0bb59',
      canonicalBridgeMaxPerTx: '1000000000'
    }
  }
}

import { Addresses } from './types'

export const addresses: Addresses = {
  USDC: {
    ethereum: {
      l1CanonicalToken: '0x655F2166b0709cd575202630952D71E2bB0d61Af',
      l1Bridge: '0x9aA5870a735ea8c43D5ca1C9322fF6187430a044'
    },
    polygon: {
      l1CanonicalBridge: '0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74',
      l1MessengerWrapper: '0x05E3B4A9C758b79776F98CbD15571fc7f5e8d2bD',
      l2CanonicalBridge: '0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1',
      l2CanonicalToken: '0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1',
      l2Bridge: '0xFf0ecd10325E9E60d941e8864f45CcF73b929e9e',
      l2HopBridgeToken: '0xcD1C7da9D80A03Aee7FB7743B5376612530DC8e5',
      l2AmmWrapper: '0x560d954308D6236F5d77665533c3Ea1c31daF358',
      l2SaddleSwap: '0x6C0DE4cA0901827dd5C3D56708B698B493F28004',
      l2SaddleLpToken: '0x37e9dEcb4D1Eb26915729B40F08c997d4FfE7793',
      l1PosRootChainManager: '0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74',
      l1PosErc20Predicate: '0xdD6596F2029e6233DEFfaCa316e6A95217d4Dc34'
    }
  }
}

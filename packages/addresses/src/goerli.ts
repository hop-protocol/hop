import { Addresses } from './types'

export const addresses: Addresses = {
  bonders: ['0x81682250D4566B2986A2B33e23e7c52D401B7aB7'],
  bridges: {
    USDC: {
      ethereum: {
        l1CanonicalToken: '0x98339D8C260052B7ad81c28c16C0b98420f2B46a',
        l1Bridge: '0xFf0ecd10325E9E60d941e8864f45CcF73b929e9e'
      },
      polygon: {
        l1CanonicalBridge: '0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74',
        l1MessengerWrapper: '0x560d954308D6236F5d77665533c3Ea1c31daF358',
        l2CanonicalBridge: '0x6D4dd09982853F08d9966aC3cA4Eb5885F16f2b2',
        l2CanonicalToken: '0x6D4dd09982853F08d9966aC3cA4Eb5885F16f2b2',
        l2Bridge: '0xc28fD2baE4c87BE8727Ec20e42127F15ED0dca57',
        l2HopBridgeToken: '0xFe94586a507866Fb6F5f69815Be140d121B993d2',
        l2AmmWrapper: '0xAf3e7d144941ffC1214B6f16B984071A09d0ba70',
        l2SaddleSwap: '0x4dedd0a4f06baD782A4025f97de2F419864f997A',
        l2SaddleLpToken: '0xCEF03390D6D9516474AaD83d273dC9f4Fd1788E6',
        l1PosRootChainManager: '0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74',
        l1PosPredicate: '0xdD6596F2029e6233DEFfaCa316e6A95217d4Dc34'
      }
    },
    DAI: {
      ethereum: {
        l1CanonicalToken: '0xC61bA16e864eFbd06a9fe30Aab39D18B8F63710a',
        l1Bridge: '0x9f67495Bd81cF9412d3d135218baE8002d408ff1'
      },
      polygon: {
        l1CanonicalBridge: '0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74',
        l1MessengerWrapper: '0x12fa8eE6e33857Be3B7d080B471A2D40821d4155',
        l2CanonicalBridge: '0xb224913CE3851b0a0d7C0FB461eEF40f2e31ddb8',
        l2CanonicalToken: '0xb224913CE3851b0a0d7C0FB461eEF40f2e31ddb8',
        l2Bridge: '0xB00e7ae2dE3eCDc8EeA1ad34A71d374E8aB25C7E',
        l2HopBridgeToken: '0x1C6fb8EFFF811Cf8aa28BA60bF419aeD1E321EC4',
        l2AmmWrapper: '0x662E244BC637035578C58ee0eEDF46049ea23801',
        l2SaddleSwap: '0x8d71Ee5587DeA8a2271013Dbc1F5e1dCBDF94E2E',
        l2SaddleLpToken: '0xF74b37E3D1A3f3f0721E0B274f47e8eCd17B4B66',
        l1PosRootChainManager: '0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74',
        l1PosPredicate: '0x37c3bfC05d5ebF9EBb3FF80ce0bd0133Bf221BC8'
      }
    }
  }
}

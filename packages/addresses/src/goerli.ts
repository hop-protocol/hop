import { Addresses } from './types'

export const addresses: Addresses = {
  bonders: ['0x81682250D4566B2986A2B33e23e7c52D401B7aB7'],
  bridges: {
    USDC: {
      ethereum: {
        l1CanonicalToken: '0x98339D8C260052B7ad81c28c16C0b98420f2B46a',
        l1Bridge: '0x30bf762D61b777aaFdd664a73C3765633276a631'
      },
      polygon: {
        l1CanonicalBridge: '0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74',
        l1MessengerWrapper: '0xDf5Af462E86EC41a7DE5E4CAE87CE4d516C9e24c',
        l2CanonicalBridge: '0x6D4dd09982853F08d9966aC3cA4Eb5885F16f2b2',
        l2CanonicalToken: '0x6D4dd09982853F08d9966aC3cA4Eb5885F16f2b2',
        l2Bridge: '0xBBF20c25bCF9065a6F72711F650E8F6D66C929e9',
        l2HopBridgeToken: '0x01C445e5D8CB18988a85B02266006A9B093267ce',
        l2AmmWrapper: '0x535E174100D0A0CD1C102D6Df4dDbA01c3677C2a',
        l2SaddleSwap: '0x01f4b3F1D2b41122f86eb6446309dA9FB05a05d5',
        l2SaddleLpToken: '0xe0fD731FF8DEb1B167047ccef0dE44b5C575Bdf2',
        l1PosRootChainManager: '0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74',
        l1PosPredicate: '0xdD6596F2029e6233DEFfaCa316e6A95217d4Dc34'
      }
    },
    DAI: {
      ethereum: {
        l1CanonicalToken: '0xC61bA16e864eFbd06a9fe30Aab39D18B8F63710a',
        l1Bridge: '0xA7d1733b49cBC400dC918d0286092C543FA03863'
      },
      polygon: {
        l1CanonicalBridge: '0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74',
        l1MessengerWrapper: '0x74d838E85EAF33Ec79D14738B08aB30229C01a70',
        l2CanonicalBridge: '0xb224913CE3851b0a0d7C0FB461eEF40f2e31ddb8',
        l2CanonicalToken: '0xb224913CE3851b0a0d7C0FB461eEF40f2e31ddb8',
        l2Bridge: '0xe756ec869624C2bC9fA0b49E877ad39b8e988008',
        l2HopBridgeToken: '0xcCf4a395F47e4038C2B88C15cC725654af99329A',
        l2AmmWrapper: '0xDA41463abD488937c770C77Adb996C20044fB1b1',
        l2SaddleSwap: '0x22c5AcA60C2f6D832f8C11992fd52fcA8A0F10ec',
        l2SaddleLpToken: '0x29204640A74f1E39f418865651c37ca1e3eD407C',
        l1PosRootChainManager: '0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74',
        l1PosPredicate: '0x37c3bfC05d5ebF9EBb3FF80ce0bd0133Bf221BC8'
      }
    }
  }
}

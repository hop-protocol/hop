import { Addresses } from './types'

export const addresses: Addresses = {
  USDC: {
    ethereum: {
      l1CanonicalToken: '0x98339D8C260052B7ad81c28c16C0b98420f2B46a',
      l1Bridge: '0x325aD30CA387f845D5D9bb3e0a9E4c061b5ACc3A'
    },
    polygon: {
      l1CanonicalBridge: '0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74',
      l1MessengerWrapper: '0xbf4afb067Cdd452EC80f75862b2C6D39FeB96476',
      l2CanonicalBridge: '0x6D4dd09982853F08d9966aC3cA4Eb5885F16f2b2',
      l2CanonicalToken: '0x6D4dd09982853F08d9966aC3cA4Eb5885F16f2b2',
      l2Bridge: '0x6cA4c985a0D67A37ac2F4d8370ebE74e248A53f2',
      l2HopBridgeToken: '0xA93eC98Ead897Ee8EF0b5CC9E2a658875719B224',
      l2AmmWrapper: '0x653354468D19e39Ae4843F91999A891fea508DF9',
      l2SaddleSwap: '0x19365928c043172bD510FF926040ca3f397e1057',
      l2SaddleLpToken: '0xf38d8966064e0751f164e77f43B3593eb16b234A',
      l1PosRootChainManager: '0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74',
      l1PosErc20Predicate: '0xdD6596F2029e6233DEFfaCa316e6A95217d4Dc34'
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
      l1PosErc20Predicate: '0x37c3bfC05d5ebF9EBb3FF80ce0bd0133Bf221BC8'
    }
  }
}

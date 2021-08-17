import { Addresses } from './types'

export const addresses: Addresses = {
  bonders: {
    USDC: ['0x81682250D4566B2986A2B33e23e7c52D401B7aB7'],
    DAI: ['0x81682250D4566B2986A2B33e23e7c52D401B7aB7']
  },
  bridges: {
    USDC: {
      ethereum: {
        l1CanonicalToken: '0x98339D8C260052B7ad81c28c16C0b98420f2B46a',
        l1Bridge: '0x39B052820F808534d5eD7C2b26f070169Fa6A686',
        bridgeDeployedBlockNumber: 4982681
      },
      polygon: {
        l1CanonicalBridge: '0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74',
        l1MessengerWrapper: '0x7a4f56B0Dd21d730604A266245a0067b97605DAE',
        l2CanonicalBridge: '0x6D4dd09982853F08d9966aC3cA4Eb5885F16f2b2',
        l2CanonicalToken: '0x6D4dd09982853F08d9966aC3cA4Eb5885F16f2b2',
        l2Bridge: '0x361926fc41109ECAA5c173c31f09dbE4ddBe1946',
        l2HopBridgeToken: '0x101E9d2E3975d29DA9191F5933490a55916135a4',
        l2AmmWrapper: '0xa228A81FA5d3525b7637ADF66FA35794451bBa7c',
        l2SaddleSwap: '0xdbD110bD0a3a7Aa1a910F28e0e7Fe98047716C5D',
        l2SaddleLpToken: '0xF78b961f6D1a7702C3204FD5a6BC8cC8ECf18741',
        l1FxBaseRootTunnel: '0x7a4f56B0Dd21d730604A266245a0067b97605DAE',
        l1PosRootChainManager: '0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74',
        l1PosPredicate: '0xdD6596F2029e6233DEFfaCa316e6A95217d4Dc34',
        bridgeDeployedBlockNumber: 15200513
      }
    },
    DAI: {
      ethereum: {
        l1CanonicalToken: '0xC61bA16e864eFbd06a9fe30Aab39D18B8F63710a',
        l1Bridge: '0x9CD998D84CE695646c3C874e8793eF4A80C2cAB8',
        bridgeDeployedBlockNumber: 4982739
      },
      polygon: {
        l1CanonicalBridge: '0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74',
        l1MessengerWrapper: '0x210942Df6AfE6Cc1d3909B0faa3B3f2D20017F0D',
        l2CanonicalBridge: '0xb224913CE3851b0a0d7C0FB461eEF40f2e31ddb8',
        l2CanonicalToken: '0xb224913CE3851b0a0d7C0FB461eEF40f2e31ddb8',
        l2Bridge: '0xF20d8390568835b36462E9931c6Bf1F243e6D30F',
        l2HopBridgeToken: '0x196F30702e8efCbE42C38cE8eE5a43E1770dE0D4',
        l2AmmWrapper: '0x6329d42Cc5517ba1d913303E019a556d84B5a05d',
        l2SaddleSwap: '0x9CDE8C9CDe29C80f374Fd43891F118aEA55eC359',
        l2SaddleLpToken: '0x6229fD561E7F49Ec84adc08F74A04D66F95AbfF7',
        l1FxBaseRootTunnel: '0x210942Df6AfE6Cc1d3909B0faa3B3f2D20017F0D',
        l1PosRootChainManager: '0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74',
        l1PosPredicate: '0x37c3bfC05d5ebF9EBb3FF80ce0bd0133Bf221BC8',
        bridgeDeployedBlockNumber: 15200943
      }
    }
  }
}

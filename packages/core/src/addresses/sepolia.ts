import { Addresses } from './types'

export const addresses: Addresses = {
  bonders: {
  },
  bridges: {
    USDC: {
      ethereum: {
        l1CanonicalToken: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
        cctpL1Bridge: '0x05fda2db623fa6a89a2db33550848ab2006a4427' // TODO cctp address
      },
      optimism: {
        l2CanonicalToken: '0x5fd84259d66Cd46123540766Be93DFE6D43130D7',
        cctpL2Bridge: '0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5' // TODO cctp address
      },
      arbitrum: {
        l2CanonicalToken: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d',
        cctpL2Bridge: '0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5' // TODO cctp address
      },
      base: {
        l2CanonicalToken: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
        cctpL2Bridge: '0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5' // TODO cctp address
      }
    },
    'USDC.e': {
      ethereum: {
        l1CanonicalToken: '0x95B01328BA6f4de261C4907fB35eE3c4968e9CEF',
        l1Bridge: '',
        cctpL1Bridge: '0x98bc5b835686e1a00e6c2168af162905899e93d6', // TODO cctp address
        bridgeDeployedBlockNumber: 12650032
      },
      optimism: {
        l1CanonicalBridge: '',
        l1MessengerWrapper: '',
        l2CanonicalBridge: '',
        l2CanonicalToken: '0xB15312eA17d95375E64317C363A0e6304330D82e',
        l2Bridge: '',
        cctpL2Bridge: '', // TODO cctp address
        l2HopBridgeToken: '',
        l2AmmWrapper: '',
        l2SaddleSwap: '',
        l2SaddleLpToken: '',
        bridgeDeployedBlockNumber: 1
      }
    },
  }
}

import { Addresses } from './types'

export const addresses: Addresses = {
  bonders: {
  },
  bridges: {
    USDC: {
      ethereum: {
        l1CanonicalToken: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
        l1Bridge: '0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5' // TODO cctp address
      },
      optimism: {
        l2CanonicalToken: '0x5fd84259d66Cd46123540766Be93DFE6D43130D7',
        l2Bridge: '0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5' // TODO cctp address
      },
      arbitrum: {
        l2CanonicalToken: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d',
        l2Bridge: '0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5' // TODO cctp address
      },
      base: {
        l2CanonicalToken: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
        l2Bridge: '0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5' // TODO cctp address
      }
    },
  }
}

import { Networks } from './types.js'

export const networks: Networks = {
  1: {
    name: 'Ethereum',
    chainId: 1,
    publicRpcUrl: 'https://mainnet.infura.io/v3/84842078b09946638c03157f83405213', // from ethers
    fallbackPublicRpcUrls: [
      'https://rpc.ankr.com/eth'
    ],
    explorerUrls: ['https://etherscan.io'],
    waitConfirmations: 64
  },
  42161: {
    name: 'Arbitrum',
    chainId: 42161,
    publicRpcUrl: 'https://arb1.arbitrum.io/rpc',
    fallbackPublicRpcUrls: [
      'https://arbitrum-mainnet.infura.io/v3/84842078b09946638c03157f83405213', // from ethers
      'https://rpc.ankr.com/arbitrum'
    ],
    explorerUrls: ['https://arbiscan.io/'],
    nativeBridgeUrl: 'https://bridge.arbitrum.io/',
    waitConfirmations: 20
  },
  10: {
    name: 'Optimism',
    chainId: 10,
    publicRpcUrl: 'https://optimism-mainnet.infura.io/v3/84842078b09946638c03157f83405213', // from ethers
    fallbackPublicRpcUrls: [
      'https://mainnet.optimism.io',
      'https://rpc.ankr.com/optimism'
    ],
    explorerUrls: ['https://optimistic.etherscan.io'],
    nativeBridgeUrl: 'https://gateway.optimism.io/welcome',
    waitConfirmations: 1
  },
  100: {
    name: 'Gnosis Chain',
    chainId: 100,
    publicRpcUrl: 'https://rpc.gnosischain.com/',
    fallbackPublicRpcUrls: [
      'https://rpc.ankr.com/gnosis'
    ],
    explorerUrls: ['https://gnosisscan.io/'],
    nativeBridgeUrl: 'https://omni.xdaichain.com/',
    waitConfirmations: 12
  },
  137: {
    name: 'Polygon',
    chainId: 137,
    publicRpcUrl: 'https://polygon-rpc.com',
    fallbackPublicRpcUrls: [
      'https://rpc.ankr.com/polygon'
    ],
    explorerUrls: ['https://polygonscan.com'],
    nativeBridgeUrl: 'https://wallet.matic.network/bridge/',
    waitConfirmations: 128
  }
}

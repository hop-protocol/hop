import { Networks } from './types.js'

export const networks: Networks = {
  5: {
    name: 'Ethereum',
    chainId: 5,
    publicRpcUrl: 'https://goerli.infura.io/v3/84842078b09946638c03157f83405213', // from ethers
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://goerli.etherscan.io'],
    waitConfirmations: 1
  },
  80001: {
    name: 'Polygon',
    chainId: 80001,
    publicRpcUrl: 'https://matic-testnet-archive-rpc.bwarelabs.com',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://mumbai.polygonscan.com'],
    nativeBridgeUrl: 'https://wallet.matic.network/bridge/',
    waitConfirmations: 1
  },
  420: {
    name: 'Optimism',
    chainId: 420,
    publicRpcUrl: 'https://goerli.optimism.io',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://goerli-optimism.etherscan.io/'],
    nativeBridgeUrl: 'https://app.optimism.io/bridge',
    waitConfirmations: 1
  },
  421613: {
    name: 'Arbitrum',
    chainId: 421613,
    publicRpcUrl: 'https://goerli-rollup.arbitrum.io/rpc',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://goerli-rollup-explorer.arbitrum.io'],
    nativeBridgeUrl: 'https://bridge.arbitrum.io/',
    waitConfirmations: 1
  }
}

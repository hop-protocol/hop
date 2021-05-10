import { Networks } from './types'

export const networks: Networks = {
  ethereum: {
    networkId: 42,
    rpcUrls: ['https://kovan.rpc.hop.exchange'],
    explorerUrls: ['https://kovan.etherscan.io']
  },
  arbitrum: {
    networkId: 212984383488152,
    rpcUrls: ['https://kovan4.arbitrum.io/rpc'],
    explorerUrls: ['https://explorer.offchainlabs.com/#/']
  },
  optimism: {
    networkId: 69,
    rpcUrls: ['https://kovan.optimism.io'],
    explorerUrls: [
      'https://expedition.dev/?rpcUrl=https%3A%2F%2Fkovan.optimism.io'
    ]
  },
  xdai: {
    networkId: 77,
    rpcUrls: [
      'https://sokol.poa.network',
      'http://sokol-archive.blockscout.com'
    ],
    explorerUrls: ['https://blockscout.com/poa/sokol']
  }
}

import { Networks } from './types'

export const networks: Networks = {
  ethereum: {
    networkId: 1,
    rpcUrls: ['https://mainnet.rpc.hop.exchange'],
    explorerUrls: ['https://etherscan.io']
  },
  arbitrum: {
    networkId: 1000,
    rpcUrls: ['https://mainnet.arbitrum.io'],
    explorerUrls: [
      'https://expedition.dev/?rpcUrl=https%3A%2F%2Fmainnet.arbitrum.io'
    ]
  },
  optimism: {
    networkId: 10,
    rpcUrls: ['https://mainnet.optimism.io'],
    explorerUrls: [
      'https://expedition.dev/?rpcUrl=https%3A%2F%2Fmainnet.arbitrum.io'
    ]
  },
  xdai: {
    networkId: 100,
    rpcUrls: [
      'https://rpc.xdaichain.com',
      'https://dai.poa.network',
      'https://xdai.poanetwork.dev',
      'https://xdai-archive.blockscout.com',
      'https://xdai.1hive.org'
    ],
    explorerUrls: ['https://blockscout.com/xdai/mainnet']
  },
  polygon: {
    networkId: 137,
    rpcUrls: ['https://rpc-mainnet.maticvigil.com'],
    explorerUrls: ['https://explorer-mainnet.maticvigil.com']
  }
}

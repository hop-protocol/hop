import { chains } from '@hop-protocol/metadata'
import { Networks } from './types'

export const networks: Networks = {
  ethereum: {
    name: chains.ethereum.name,
    networkId: 42,
    rpcUrls: ['https://kovan.rpc.hop.exchange'],
    explorerUrls: ['https://kovan.etherscan.io']
  },
  arbitrum: {
    name: chains.arbitrum.name,
    networkId: 212984383488152,
    rpcUrls: ['https://kovan4.arbitrum.io/rpc'],
    explorerUrls: ['https://explorer.offchainlabs.com/#/']
  },
  optimism: {
    name: chains.optimism.name,
    networkId: 69,
    rpcUrls: ['https://kovan.optimism.io'],
    explorerUrls: [
      'https://expedition.dev/?rpcUrl=https%3A%2F%2Fkovan.optimism.io'
    ]
  },
  xdai: {
    name: chains.xdai.name,
    networkId: 77,
    rpcUrls: [
      'https://sokol.poa.network'
      //'https://sokol-archive.blockscout.com'
    ],
    explorerUrls: ['https://blockscout.com/poa/sokol']
  }
}

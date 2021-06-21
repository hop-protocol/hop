import { chains } from '@hop-protocol/metadata'
import { Networks } from './types'

export const networks: Networks = {
  ethereum: {
    name: chains.ethereum.name,
    networkId: 1,
    rpcUrls: ['https://mainnet.rpc.hop.exchange'],
    explorerUrls: ['https://etherscan.io']
  },
  arbitrum: {
    name: chains.arbitrum.name,
    networkId: 1000,
    rpcUrls: ['https://mainnet.arbitrum.io'],
    explorerUrls: [
      'https://expedition.dev/?rpcUrl=https%3A%2F%2Fmainnet.arbitrum.io'
    ],
    nativeBridgeUrl: 'https://bridge.arbitrum.io/'
  },
  optimism: {
    name: chains.optimism.name,
    networkId: 10,
    rpcUrls: ['https://mainnet.optimism.io'],
    explorerUrls: ['https://optimistic.etherscan.io'],
    nativeBridgeUrl: 'https://gateway.optimism.io/welcome'
  },
  xdai: {
    name: chains.xdai.name,
    networkId: 100,
    rpcUrls: [
      'https://rpc.xdaichain.com',
      'https://dai.poa.network',
      'https://xdai.poanetwork.dev',
      'https://xdai-archive.blockscout.com',
      'https://xdai.1hive.org'
      // wss://rpc.xdaichain.com/wss
      // wss://xdai.poanetwork.dev/wss
    ],
    explorerUrls: ['https://blockscout.com/xdai/mainnet'],
    nativeBridgeUrl: 'https://omni.xdaichain.com/'
  },
  polygon: {
    name: chains.polygon.name,
    networkId: 137,
    rpcUrls: [
      'https://polygon.rpc.hop.exchange',
      'https://rpc-mainnet.maticvigil.com'
    ],
    explorerUrls: ['https://polygonscan.com'],
    nativeBridgeUrl: 'https://wallet.matic.network/bridge/'
  }
}

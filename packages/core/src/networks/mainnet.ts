import { chains } from '../metadata'
import { Networks } from './types'

export const networks: Networks = {
  ethereum: {
    name: chains.ethereum.name,
    networkId: 1,
    rpcUrls: ['https://mainnet.rpc.hop.exchange'],
    explorerUrls: ['https://etherscan.io'],
    waitConfirmations: 12
  },
  arbitrum: {
    name: chains.arbitrum.name,
    networkId: 1000,
    rpcUrls: ['https://mainnet.arbitrum.io'],
    explorerUrls: [
      'https://expedition.dev/?rpcUrl=https%3A%2F%2Fmainnet.arbitrum.io'
    ],
    nativeBridgeUrl: 'https://bridge.arbitrum.io/',
    waitConfirmations: 0
  },
  optimism: {
    name: chains.optimism.name,
    networkId: 10,
    rpcUrls: ['https://mainnet.optimism.io'],
    explorerUrls: ['https://optimistic.etherscan.io'],
    nativeBridgeUrl: 'https://gateway.optimism.io/welcome',
    waitConfirmations: 0
  },
  xdai: {
    name: chains.xdai.name,
    networkId: 100,
    rpcUrls: ['https://xdai.rpc.hop.exchange'],
    explorerUrls: ['https://blockscout.com/xdai/mainnet'],
    nativeBridgeUrl: 'https://omni.xdaichain.com/',
    waitConfirmations: 12
  },
  polygon: {
    name: chains.polygon.name,
    networkId: 137,
    rpcUrls: ['https://polygon.rpc.hop.exchange'],
    explorerUrls: ['https://polygonscan.com'],
    nativeBridgeUrl: 'https://wallet.matic.network/bridge/',
    waitConfirmations: 124
  }
}

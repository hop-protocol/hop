import { chains } from '../metadata'
import { Networks } from './types'

export const networks: Networks = {
  ethereum: {
    name: chains.ethereum.name,
    networkId: 42,
    rpcUrls: ['https://kovan.rpc.hop.exchange'],
    archiveRpcUrls: ['https://kovan.rpc.hop.exchange'],
    explorerUrls: ['https://kovan.etherscan.io'],
    waitConfirmations: 1
  },
  arbitrum: {
    name: chains.arbitrum.name,
    networkId: 212984383488152,
    rpcUrls: ['https://kovan4.arbitrum.io/rpc'],
    archiveRpcUrls: [],
    explorerUrls: ['https://explorer.offchainlabs.com/#/'],
    nativeBridgeUrl: 'https://bridge.arbitrum.io/',
    waitConfirmations: 1
  },
  optimism: {
    name: chains.optimism.name,
    networkId: 69,
    rpcUrls: ['https://kovan.optimism.io'],
    archiveRpcUrls: [],
    explorerUrls: ['https://kovan-optimistic.etherscan.io'],
    nativeBridgeUrl: 'https://gateway.optimism.io/welcome',
    waitConfirmations: 1
  },
  xdai: {
    name: chains.xdai.name,
    networkId: 77,
    rpcUrls: [
      'https://sokol.poa.network',
      'https://sokol-archive.blockscout.com'
    ],
    archiveRpcUrls: [
      'https://sokol.poa.network',
      'https://sokol-archive.blockscout.com'
    ],
    explorerUrls: ['https://blockscout.com/poa/sokol'],
    nativeBridgeUrl: 'https://omni.xdaichain.com/',
    waitConfirmations: 1
  }
}

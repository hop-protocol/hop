import { Networks } from './types'
import { chains } from '../metadata'

export const networks: Networks = {
  ethereum: {
    name: chains.ethereum.name,
    image: chains.ethereum.image,
    networkId: 42,
    publicRpcUrl: 'https://kovan.infura.io/v3/84842078b09946638c03157f83405213', // from ethers
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://kovan.etherscan.io'],
    waitConfirmations: 64,
    hasFinalizationBlockTag: false
  },
  optimism: {
    name: chains.optimism.name,
    image: chains.optimism.image,
    networkId: 69,
    publicRpcUrl: 'https://kovan.optimism.io',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://kovan-optimistic.etherscan.io'],
    nativeBridgeUrl: 'https://gateway.optimism.io/welcome',
    waitConfirmations: 64,
    hasFinalizationBlockTag: false
  },
  gnosis: {
    name: chains.gnosis.name,
    image: chains.gnosis.image,
    networkId: 77,
    publicRpcUrl: 'https://sokol.poa.network',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://blockscout.com/poa/sokol'],
    nativeBridgeUrl: 'https://omni.xdaichain.com/',
    waitConfirmations: 64,
    hasFinalizationBlockTag: false
  }
}

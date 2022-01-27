import { Networks } from './types'
import { chains } from '../metadata'

export const networks: Networks = {
  ethereum: {
    name: chains.ethereum.name,
    networkId: 42,
    publicRpcUrl: 'https://kovan.infura.io/v3/84842078b09946638c03157f83405213', // from ethers
    explorerUrls: ['https://kovan.etherscan.io'],
    waitConfirmations: 1
  },
  optimism: {
    name: chains.optimism.name,
    networkId: 69,
    publicRpcUrl: 'https://kovan.optimism.io',
    explorerUrls: ['https://kovan-optimistic.etherscan.io'],
    nativeBridgeUrl: 'https://gateway.optimism.io/welcome',
    waitConfirmations: 1
  },
  gnosis: {
    name: chains.gnosis.name,
    networkId: 77,
    publicRpcUrl: 'https://sokol.poa.network',
    explorerUrls: ['https://blockscout.com/poa/sokol'],
    nativeBridgeUrl: 'https://omni.xdaichain.com/',
    waitConfirmations: 1
  }
}

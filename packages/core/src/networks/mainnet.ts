import { Networks } from './types'
import { chains } from '../metadata'

export const networks: Networks = {
  ethereum: {
    name: chains.ethereum.name,
    networkId: 1,
    publicRpcUrl: 'https://mainnet.infura.io/v3/84842078b09946638c03157f83405213', // from ethers
    explorerUrls: ['https://etherscan.io'],
    waitConfirmations: 12
  },
  arbitrum: {
    name: chains.arbitrum.name,
    networkId: 42161,
    publicRpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorerUrls: ['https://arbiscan.io/'],
    nativeBridgeUrl: 'https://bridge.arbitrum.io/',
    waitConfirmations: 20
  },
  optimism: {
    name: chains.optimism.name,
    networkId: 10,
    publicRpcUrl: 'https://mainnet.optimism.io',
    explorerUrls: ['https://optimistic.etherscan.io'],
    nativeBridgeUrl: 'https://gateway.optimism.io/welcome',
    waitConfirmations: 1
  },
  gnosis: {
    name: chains.gnosis.name,
    networkId: 100,
    publicRpcUrl: 'https://rpc.gnosischain.com/',
    explorerUrls: ['https://blockscout.com/xdai/mainnet'],
    nativeBridgeUrl: 'https://omni.xdaichain.com/',
    waitConfirmations: 12
  },
  polygon: {
    name: chains.polygon.name,
    networkId: 137,
    publicRpcUrl: 'https://polygon-rpc.com',
    explorerUrls: ['https://polygonscan.com'],
    nativeBridgeUrl: 'https://wallet.matic.network/bridge/',
    waitConfirmations: 128
  }
}

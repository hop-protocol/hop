import { Networks } from './types'
import { chains } from '../metadata'

export const networks: Networks = {
  ethereum: {
    name: chains.ethereum.name,
    networkId: 5,
    publicRpcUrl: 'https://goerli.infura.io/v3/84842078b09946638c03157f83405213', // from ethers
    explorerUrls: ['https://goerli.etherscan.io'],
    waitConfirmations: 1
  },
  polygon: {
    name: chains.polygon.name,
    networkId: 80001,
    publicRpcUrl: 'https://matic-testnet-archive-rpc.bwarelabs.com',
    explorerUrls: ['https://mumbai.polygonscan.com'],
    nativeBridgeUrl: 'https://wallet.matic.network/bridge/',
    waitConfirmations: 1
  },
  optimism: {
    name: chains.optimism.name,
    networkId: 420,
    publicRpcUrl: 'https://goerli.optimism.io',
    explorerUrls: ['https://goerli-optimism.etherscan.io/'],
    nativeBridgeUrl: 'https://app.optimism.io/bridge',
    waitConfirmations: 1
  },
  arbitrum: {
    name: chains.arbitrum.name,
    networkId: 421613,
    publicRpcUrl: 'https://goerli-rollup.arbitrum.io/rpc',
    explorerUrls: ['https://goerli-rollup-explorer.arbitrum.io'],
    nativeBridgeUrl: 'https://bridge.arbitrum.io/',
    waitConfirmations: 1
  }
}

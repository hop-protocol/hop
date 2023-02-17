import { Networks } from './types'
import { chains } from '../metadata'

export const networks: Networks = {
  ethereum: {
    name: chains.ethereum.name,
    image: chains.ethereum.image,
    networkId: 5,
    publicRpcUrl: 'https://goerli.infura.io/v3/84842078b09946638c03157f83405213', // from ethers
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://goerli.etherscan.io'],
    waitConfirmations: 1
  },
  polygon: {
    name: chains.polygon.name,
    image: chains.polygon.image,
    networkId: 80001,
    publicRpcUrl: 'https://matic-testnet-archive-rpc.bwarelabs.com',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://mumbai.polygonscan.com'],
    nativeBridgeUrl: 'https://wallet.matic.network/bridge/',
    waitConfirmations: 1
  },
  optimism: {
    name: chains.optimism.name,
    image: chains.optimism.image,
    networkId: 420,
    publicRpcUrl: 'https://goerli.optimism.io',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://goerli-optimism.etherscan.io/'],
    nativeBridgeUrl: 'https://app.optimism.io/bridge',
    waitConfirmations: 1
  },
  arbitrum: {
    name: chains.arbitrum.name,
    image: chains.arbitrum.image,
    networkId: 421613,
    publicRpcUrl: 'https://goerli-rollup.arbitrum.io/rpc',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://goerli-rollup-explorer.arbitrum.io'],
    nativeBridgeUrl: 'https://bridge.arbitrum.io/',
    waitConfirmations: 1
  },
  zksync: {
    name: chains.zksync.name,
    image: chains.zksync.image,
    networkId: 280,
    publicRpcUrl: 'https://zksync2-testnet.zksync.dev',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://goerli.explorer.zksync.io', 'https://zksync2-testnet.zkscan.io'],
    nativeBridgeUrl: '',
    waitConfirmations: 1
  },
  consensyszk: {
    name: chains.consensyszk.name,
    image: chains.consensyszk.image,
    networkId: 59140,
    publicRpcUrl: 'https://consensys-zkevm-goerli-prealpha.infura.io/v3/9d6a30e37af5474a98d9acf6470473de',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://explorer.goerli.zkevm.consensys.net'],
    nativeBridgeUrl: 'https://bridge.goerli.zkevm.consensys.net',
    waitConfirmations: 1
  },
  scrollzk: {
    name: chains.scrollzk.name,
    image: chains.scrollzk.image,
    networkId: 534354,
    publicRpcUrl: 'https://prealpha-rpc.scroll.io/l2',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://l2scan.scroll.io'],
    nativeBridgeUrl: 'https://scroll.io/prealpha/bridge',
    waitConfirmations: 1
  }
}

import { Networks } from './types'
import { chains } from '../metadata'

export const networks: Networks = {
  ethereum: {
    name: chains.ethereum.name,
    image: chains.ethereum.image,
    networkId: 1,
    publicRpcUrl: 'https://mainnet.infura.io/v3/84842078b09946638c03157f83405213', // from ethers
    fallbackPublicRpcUrls: [
      'https://rpc.ankr.com/eth'
    ],
    explorerUrls: ['https://etherscan.io'],
    waitConfirmations: 64
  },
  arbitrum: {
    name: chains.arbitrum.name,
    image: chains.arbitrum.image,
    networkId: 42161,
    publicRpcUrl: 'https://arb1.arbitrum.io/rpc',
    fallbackPublicRpcUrls: [
      'https://arbitrum-mainnet.infura.io/v3/84842078b09946638c03157f83405213', // from ethers
      'https://rpc.ankr.com/arbitrum'
    ],
    explorerUrls: ['https://arbiscan.io/'],
    nativeBridgeUrl: 'https://bridge.arbitrum.io/',
    waitConfirmations: 20
  },
  optimism: {
    name: chains.optimism.name,
    image: chains.optimism.image,
    networkId: 10,
    publicRpcUrl: 'https://optimism-mainnet.infura.io/v3/84842078b09946638c03157f83405213', // from ethers
    fallbackPublicRpcUrls: [
      'https://rpc.ankr.com/optimism',
      'https://mainnet.optimism.io'
    ],
    explorerUrls: ['https://optimistic.etherscan.io'],
    nativeBridgeUrl: 'https://gateway.optimism.io/welcome',
    waitConfirmations: 1
  },
  gnosis: {
    name: chains.gnosis.name,
    image: chains.gnosis.image,
    networkId: 100,
    publicRpcUrl: 'https://rpc.gnosis.gateway.fm',
    fallbackPublicRpcUrls: [
      'https://rpc.ankr.com/gnosis',
      'https://rpc.gnosischain.com'
    ],
    explorerUrls: ['https://gnosisscan.io/'],
    nativeBridgeUrl: 'https://omni.xdaichain.com/',
    waitConfirmations: 12
  },
  polygon: {
    name: chains.polygon.name,
    image: chains.polygon.image,
    networkId: 137,
    publicRpcUrl: 'https://polygon-rpc.com',
    fallbackPublicRpcUrls: [
      'https://rpc.ankr.com/polygon'
    ],
    explorerUrls: ['https://polygonscan.com'],
    nativeBridgeUrl: 'https://wallet.matic.network/bridge/',
    waitConfirmations: 256
  },
  nova: {
    name: chains.nova.name,
    image: chains.nova.image,
    networkId: 42170,
    publicRpcUrl: 'https://nova.arbitrum.io/rpc',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://nova.arbiscan.io/'],
    nativeBridgeUrl: 'https://bridge.arbitrum.io/',
    waitConfirmations: 20
  }
  /*
  zksync: {
    name: chains.zksync.name,
    image: chains.zksync.image,
    networkId: 324,
    publicRpcUrl: 'https://zksync2-mainnet.zksync.io',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://explorer.zksync.io/'],
    nativeBridgeUrl: '',
    waitConfirmations: 1
  }
  linea: {
    name: chains.linea.name,
    image: chains.linea.image,
    networkId: 0,
    publicRpcUrl: '',
    fallbackPublicRpcUrls: [],
    explorerUrls: [''],
    nativeBridgeUrl: '',
    waitConfirmations: 1
  }
  */
}

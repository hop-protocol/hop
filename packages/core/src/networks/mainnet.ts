import { BaseChainData } from './shared'
import { Networks } from './types'

export const networks: Networks = {
  ethereum: {
    name: BaseChainData.ethereum.name,
    image: BaseChainData.ethereum.image,
    networkId: 1,
    publicRpcUrl: 'https://mainnet.infura.io/v3/84842078b09946638c03157f83405213', // from ethers
    fallbackPublicRpcUrls: [
      'https://rpc.ankr.com/eth'
    ],
    explorerUrls: ['https://etherscan.io'],
    waitConfirmations: 64,
    finalityTags: BaseChainData.ethereum.finalityTags,
    subgraphUrl: 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop-mainnet',
    etherscanApiUrl: 'https://api.etherscan.io'
  },
  arbitrum: {
    name: BaseChainData.arbitrum.name,
    image: BaseChainData.arbitrum.image,
    networkId: 42161,
    publicRpcUrl: 'https://arb1.arbitrum.io/rpc',
    fallbackPublicRpcUrls: [
      'https://arbitrum-mainnet.infura.io/v3/84842078b09946638c03157f83405213', // from ethers
      'https://rpc.ankr.com/arbitrum'
    ],
    explorerUrls: ['https://arbiscan.io'],
    nativeBridgeUrl: 'https://bridge.arbitrum.io',
    waitConfirmations: 64,
    finalityTags: BaseChainData.arbitrum.finalityTags,
    subgraphUrl: 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop-arbitrum',
    etherscanApiUrl: 'https://api.arbiscan.io'
  },
  optimism: {
    name: BaseChainData.optimism.name,
    image: BaseChainData.optimism.image,
    networkId: 10,
    publicRpcUrl: 'https://optimism-mainnet.infura.io/v3/84842078b09946638c03157f83405213', // from ethers
    fallbackPublicRpcUrls: [
      'https://rpc.ankr.com/optimism',
      'https://mainnet.optimism.io'
    ],
    explorerUrls: ['https://optimistic.etherscan.io'],
    nativeBridgeUrl: 'https://gateway.optimism.io/welcome',
    waitConfirmations: 64,
    finalityTags: BaseChainData.optimism.finalityTags,
    subgraphUrl: 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop-optimism',
    etherscanApiUrl: 'https://api-optimistic.etherscan.io'
  },
  gnosis: {
    name: BaseChainData.gnosis.name,
    image: BaseChainData.gnosis.image,
    networkId: 100,
    publicRpcUrl: 'https://rpc.gnosis.gateway.fm',
    fallbackPublicRpcUrls: [
      'https://rpc.ankr.com/gnosis',
      'https://rpc.gnosischain.com'
    ],
    explorerUrls: ['https://gnosisscan.io'],
    nativeBridgeUrl: 'https://omni.xdaichain.com',
    waitConfirmations: 20,
    finalityTags: BaseChainData.gnosis.finalityTags,
    subgraphUrl: 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop-xdai',
    etherscanApiUrl: 'https://api.gnosisscan.io'
  },
  polygon: {
    name: BaseChainData.polygon.name,
    image: BaseChainData.polygon.image,
    networkId: 137,
    publicRpcUrl: 'https://polygon-rpc.com',
    fallbackPublicRpcUrls: [
      'https://rpc.ankr.com/polygon'
    ],
    explorerUrls: ['https://polygonscan.com'],
    nativeBridgeUrl: 'https://wallet.matic.network/bridge',
    finalityTags: BaseChainData.polygon.finalityTags,
    waitConfirmations: 256,
    subgraphUrl: 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop-polygon',
    etherscanApiUrl: 'https://api.polygonscan.com'
  },
  nova: {
    name: BaseChainData.nova.name,
    image: BaseChainData.nova.image,
    networkId: 42170,
    publicRpcUrl: 'https://nova.arbitrum.io/rpc',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://nova.arbiscan.io'],
    nativeBridgeUrl: 'https://bridge.arbitrum.io',
    waitConfirmations: 64,
    finalityTags: BaseChainData.nova.finalityTags,
    subgraphUrl: 'https://nova.subgraph.hop.exchange/subgraphs/name/hop-protocol/hop-nova',
    etherscanApiUrl: 'https://api-nova.arbiscan.io'
  },
  base: {
    name: BaseChainData.base.name,
    image: BaseChainData.base.image,
    networkId: 8453,
    publicRpcUrl: 'https://mainnet.base.org',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://basescan.org'],
    nativeBridgeUrl: 'https://bridge.base.org/deposit',
    waitConfirmations: 64,
    finalityTags: BaseChainData.base.finalityTags,
    subgraphUrl: 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop-base',
    etherscanApiUrl: 'https://api.basescan.org'
  }
  /*
  zksync: {
    name: BaseChainData.zksync.name,
    image: BaseChainData.zksync.image,
    networkId: 324,
    publicRpcUrl: 'https://zksync2-mainnet.zksync.io',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://explorer.zksync.io'],
    finalityTags: BaseChainData.zksync.finalityTags,
    nativeBridgeUrl: '',
    waitConfirmations: 1
  }
  linea: {
    name: BaseChainData.linea.name,
    image: BaseChainData.linea.image,
    networkId: 0,
    publicRpcUrl: '',
    fallbackPublicRpcUrls: [],
    explorerUrls: [''],
    finalityTags: BaseChainData.linea.finalityTags,
    nativeBridgeUrl: '',
    waitConfirmations: 1
  }
  */
}

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
    subgraphUrl: 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop-mainnet',
    etherscanApiUrl: 'https://api.etherscan.io',
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11'
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
    explorerUrls: ['https://arbiscan.io'],
    nativeBridgeUrl: 'https://bridge.arbitrum.io',
    subgraphUrl: 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop-arbitrum',
    etherscanApiUrl: 'https://api.arbiscan.io',
    isRollup: true,
    isRelayable: true,
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11'
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
    subgraphUrl: 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop-optimism',
    etherscanApiUrl: 'https://api-optimistic.etherscan.io',
    isRollup: true,
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11'
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
    explorerUrls: ['https://gnosisscan.io'],
    nativeBridgeUrl: 'https://omni.xdaichain.com',
    subgraphUrl: 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop-xdai',
    etherscanApiUrl: 'https://api.gnosisscan.io',
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11'
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
    nativeBridgeUrl: 'https://wallet.matic.network/bridge',
    subgraphUrl: 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop-polygon',
    etherscanApiUrl: 'https://api.polygonscan.com',
    txOverrides: {
      // Not all Polygon nodes follow recommended 30 Gwei gasPrice
      // https://forum.matic.network/t/recommended-min-gas-price-setting/2531
      minGasPrice: 30_000_000_000,
      minGasLimit: 1_000_000
    },
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11'
  },
  nova: {
    name: chains.nova.name,
    image: chains.nova.image,
    networkId: 42170,
    publicRpcUrl: 'https://nova.arbitrum.io/rpc',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://nova.arbiscan.io'],
    nativeBridgeUrl: 'https://bridge.arbitrum.io',
    subgraphUrl: 'https://nova.subgraph.hop.exchange/subgraphs/name/hop-protocol/hop-nova',
    etherscanApiUrl: 'https://api-nova.arbiscan.io',
    isRollup: true,
    isRelayable: true,
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11'
  },
  base: {
    name: chains.base.name,
    image: chains.base.image,
    networkId: 8453,
    publicRpcUrl: 'https://mainnet.base.org',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://basescan.org'],
    nativeBridgeUrl: 'https://bridge.base.org/deposit',
    subgraphUrl: 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop-base',
    etherscanApiUrl: 'https://api.basescan.org',
    isRollup: true,
    multicall: '0xca11bde05977b3631167028862be2a173976ca11'
  },
  linea: {
    name: chains.linea.name,
    image: chains.linea.image,
    networkId: 59144,
    publicRpcUrl: 'https://rpc.linea.build',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://lineascan.build/'],
    nativeBridgeUrl: 'https://bridge.linea.build/',
    subgraphUrl: 'https://linea.subgraph.hop.exchange/subgraphs/name/hop-protocol/hop-linea',
    etherscanApiUrl: 'https://api.lineascan.build',
    isRollup: true,
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11'
  }
  /*
  zksync: {
    name: chains.zksync.name,
    image: chains.zksync.image,
    networkId: 324,
    publicRpcUrl: 'https://zksync2-mainnet.zksync.io',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://explorer.zksync.io'],
    nativeBridgeUrl: '',
    isRollup: true,
    multicall: '0xF9cda624FBC7e059355ce98a31693d299FACd963'
  }
  */
}

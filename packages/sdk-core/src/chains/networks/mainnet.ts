import { NO_PARENT_CHAIN_ID, sharedChain } from './shared.js'
import { type Chains } from '../types.js'
import { TokenSymbol } from '#tokens/index.js'

export const chains: Chains = {
  ethereum: {
    ...sharedChain.ethereum,
    chainId: '1',
    parentChainId: NO_PARENT_CHAIN_ID,
    publicRpcUrl: 'https://mainnet.infura.io/v3/84842078b09946638c03157f83405213', // from ethers
    fallbackPublicRpcUrls: [
      'https://rpc.ankr.com/eth'
    ],
    explorerUrls: ['https://etherscan.io'],
    subgraphUrl: 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop-mainnet',
    etherscanApiUrl: 'https://api.etherscan.io',
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    txOverrides: {}
  },
  arbitrum: {
    ...sharedChain.arbitrum,
    chainId: '42161',
    parentChainId: '1',
    publicRpcUrl: 'https://arb1.arbitrum.io/rpc',
    fallbackPublicRpcUrls: [
      'https://arbitrum-mainnet.infura.io/v3/84842078b09946638c03157f83405213', // from ethers
      'https://rpc.ankr.com/arbitrum'
    ],
    explorerUrls: ['https://arbiscan.io'],
    subgraphUrl: 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop-arbitrum',
    etherscanApiUrl: 'https://api.arbiscan.io',
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    txOverrides: {}
  },
  optimism: {
    ...sharedChain.optimism,
    chainId: '10',
    parentChainId: '1',
    publicRpcUrl: 'https://optimism-mainnet.infura.io/v3/84842078b09946638c03157f83405213', // from ethers
    fallbackPublicRpcUrls: [
      'https://rpc.ankr.com/optimism',
      'https://mainnet.optimism.io'
    ],
    explorerUrls: ['https://optimistic.etherscan.io'],
    subgraphUrl: 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop-optimism',
    etherscanApiUrl: 'https://api-optimistic.etherscan.io',
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    txOverrides: {}
  },
  gnosis: {
    ...sharedChain.gnosis,
    chainId: '100',
    parentChainId: '1',
    publicRpcUrl: 'https://rpc.gnosis.gateway.fm',
    fallbackPublicRpcUrls: [
      'https://rpc.ankr.com/gnosis',
      'https://rpc.gnosischain.com'
    ],
    explorerUrls: ['https://gnosisscan.io'],
    subgraphUrl: 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop-xdai',
    etherscanApiUrl: 'https://api.gnosisscan.io',
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    txOverrides: {
      minGasPrice: 1500000000 // 1.5 gwei
    }
  },
  polygon: {
    ...sharedChain.polygon,
    chainId: '137',
    parentChainId: '1',
    publicRpcUrl: 'https://polygon-rpc.com',
    fallbackPublicRpcUrls: [
      'https://rpc.ankr.com/polygon'
    ],
    explorerUrls: ['https://polygonscan.com'],
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
    ...sharedChain.nova,
    chainId: '42170',
    parentChainId: '1',
    publicRpcUrl: 'https://nova.arbitrum.io/rpc',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://nova.arbiscan.io'],
    subgraphUrl: 'https://nova.subgraph.hop.exchange/subgraphs/name/hop-protocol/hop-nova',
    etherscanApiUrl: 'https://api-nova.arbiscan.io',
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    txOverrides: {}
  },
  base: {
    ...sharedChain.base,
    chainId: '8453',
    parentChainId: '1',
    publicRpcUrl: 'https://mainnet.base.org',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://basescan.org'],
    subgraphUrl: 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop-base',
    etherscanApiUrl: 'https://api.basescan.org',
    multicall: '0xca11bde05977b3631167028862be2a173976ca11',
    txOverrides: {}
  },
  linea: {
    ...sharedChain.linea,
    chainId: '59144',
    parentChainId: '1',
    publicRpcUrl: 'https://rpc.linea.build',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://lineascan.build/'],
    subgraphUrl: 'https://linea.subgraph.hop.exchange/subgraphs/name/hop-protocol/hop-linea',
    etherscanApiUrl: 'https://api.lineascan.build',
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    txOverrides: {}
  },
  polygonzk: {
    ...sharedChain.polygonzk,
    chainId: '1101',
    parentChainId: '1',
    publicRpcUrl: 'https://zkevm-rpc.com',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://zkevm.polygonscan.com/'],
    subgraphUrl: 'https://polygonzk.subgraph.hop.exchange/subgraphs/name/hop-protocol/hop-polygonzk',
    etherscanApiUrl: 'https://api-zkevm.polygonscan.com',
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    txOverrides: {}
  }
}

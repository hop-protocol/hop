import { NO_PARENT_CHAIN_ID, sharedChain } from './shared.js'
import type { Chains } from '../types.js'

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
    // This is a placeholder subgraph URL. The API key will be removed
    subgraphUrl: 'https://gateway-arbitrum.network.thegraph.com/api/99487c5cbef9975e23a0ba6bacf5ef15/subgraphs/id/E9ars1Dv5NR4n7h6zj1NE9HNKcN6PCFYc38duwXfruCN',
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
    // This is a placeholder subgraph URL. The API key will be removed
    subgraphUrl: 'https://gateway-arbitrum.network.thegraph.com/api/db2f8ed6991204cb18efb068454552d7/subgraphs/id/FBJtdRbCYDeQKbth5KTpqN3RXCRhGSg3bdiZVGUv7Vx4',
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
    // This is a placeholder subgraph URL. The API key will be removed
    subgraphUrl: 'https://gateway-arbitrum.network.thegraph.com/api/7b8d7c8ccda8d3128cb383b5ec8e61a1/subgraphs/id/GUb7jdSZ3qAUxA7q4GSzVQKVLdGuePhh8UvQLLDGpPZK',
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
    // This is a placeholder subgraph URL. The API key will be removed
    subgraphUrl: 'https://gateway-arbitrum.network.thegraph.com/api/da7eff85b91ed0e2f7c46653068050b3/subgraphs/id/GcYkjMbTYYbarjoY99kQJZEUAv1rxQPJiWPcZhBpYSC1',
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
    // This is a placeholder subgraph URL. The API key will be removed
    subgraphUrl: 'https://gateway-arbitrum.network.thegraph.com/api/22e2ed843249e40568457e147dd4eb0b/subgraphs/id/37p7BEvXpZ72URtNZtHHW7pTqzmqyT9XmxvKHj6DGJmy',
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
    // This is a placeholder subgraph URL. The API key will be removed
    subgraphUrl: 'https://gateway-arbitrum.network.thegraph.com/api/a0b705b1b518cb9a649b8eb0fa484d6b/subgraphs/id/Be1kFUUP7S7JTyF2KUqpGVkWfFhhZgq69SpgWYDkD5px',
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

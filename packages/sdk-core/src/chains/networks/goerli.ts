import { NO_PARENT_CHAIN_ID, sharedChain } from './shared.js'
import { type Chains } from '../types.js'
import { TokenSymbol } from '#tokens/index.js'

export const chains: Chains = {
  ethereum: {
    ...sharedChain.ethereum,
    chainId: 5,
    parentChainId: NO_PARENT_CHAIN_ID,
    publicRpcUrl: 'https://goerli.infura.io/v3/84842078b09946638c03157f83405213', // from ethers
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://goerli.etherscan.io'],
    subgraphUrl: 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop-goerli',
    txOverrides: {
      minGasLimit: 1_000_000
    },
    etherscanApiUrl: '',
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11'
  },
  polygon: {
    ...sharedChain.polygon,
    chainId: 80001,
    parentChainId: 5,
    publicRpcUrl: 'https://rpc.ankr.com/polygon_mumbai',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://mumbai.polygonscan.com'],
    subgraphUrl: 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop-mumbai',
    txOverrides: {
      minGasPrice: 30_000_000_000,
      minGasLimit: 1_000_000
    },
    etherscanApiUrl: '',
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11'
  },
  optimism: {
    ...sharedChain.optimism,
    chainId: 420,
    parentChainId: 5,
    publicRpcUrl: 'https://goerli.optimism.io',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://goerli-optimism.etherscan.io'],
    subgraphUrl: 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop-optimism-goerli',
    etherscanApiUrl: '',
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    txOverrides: {}
  },
  arbitrum: {
    ...sharedChain.arbitrum,
    chainId: 421613,
    parentChainId: 5,
    publicRpcUrl: 'https://goerli-rollup.arbitrum.io/rpc',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://goerli.arbiscan.io/'],
    subgraphUrl: 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop-arbitrum-goerli',
    etherscanApiUrl: '',
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    txOverrides: {}
  },
  zksync: {
    ...sharedChain.zksync,
    chainId: 280,
    parentChainId: 5,
    publicRpcUrl: 'https://zksync2-testnet.zksync.dev',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://goerli.explorer.zksync.io', 'https://zksync2-testnet.zkscan.io'],
    etherscanApiUrl: '',
    subgraphUrl: '',
    multicall: '0xF9cda624FBC7e059355ce98a31693d299FACd963',
    txOverrides: {}
  },
  linea: {
    ...sharedChain.linea,
    chainId: 59140,
    parentChainId: 5,
    publicRpcUrl: 'https://rpc.goerli.linea.build',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://explorer.goerli.linea.build'],
    subgraphUrl: 'https://linea-goerli.subgraph.hop.exchange/subgraphs/name/hop-protocol/hop-linea-goerli',
    etherscanApiUrl: '',
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    txOverrides: {}
  },
  scrollzk: {
    ...sharedChain.scrollzk,
    chainId: 534354,
    parentChainId: 5,
    publicRpcUrl: 'https://prealpha-rpc.scroll.io/l2',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://l2scan.scroll.io'],
    subgraphUrl: '',
    etherscanApiUrl: '',
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    txOverrides: {}
  },
  base: {
    ...sharedChain.base,
    chainId: 84531,
    parentChainId: 5,
    publicRpcUrl: 'https://goerli.base.org',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://goerli.basescan.org'],
    subgraphUrl: 'https://base-goerli.subgraph.hop.exchange/subgraphs/name/hop-protocol/hop-base-goerli',
    etherscanApiUrl: '',
    multicall: '0xca11bde05977b3631167028862be2a173976ca11',
    txOverrides: {}
  },
  polygonzk: {
    ...sharedChain.polygonzk,
    chainId: 1442,
    parentChainId: 5,
    publicRpcUrl: 'https://rpc.public.zkevm-test.net',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://explorer.public.zkevm-test.net'],
    subgraphUrl: '',
    etherscanApiUrl: '',
    multicall: '0xca11bde05977b3631167028862be2a173976ca11',
    txOverrides: {}
  }
}

import { NO_PARENT_CHAIN_ID, sharedChain } from './shared.js'
import type { ChainConfig } from './types.js'

export const chains: Record<string, ChainConfig> = {
  '1': {
    ...sharedChain.ethereum,
    chainId: '1',
    parentChainId: NO_PARENT_CHAIN_ID,
    rpcUrl: 'https://1rpc.io/eth',
    fallbackRpcUrls: [
      'https://eth.drpc.org',
      'https://rpc.eth.gateway.fm',
      'https://rpc.ankr.com/eth',
      'https://rpc.flashbots.net',
      'https://mainnet.infura.io/v3/84842078b09946638c03157f83405213', // from ethers
    ],
    explorerUrls: ['https://etherscan.io'],
    subgraphUrl: 'https://subgraph.hop.exchange/ethereum',
    etherscanApiUrl: 'https://api.etherscan.io',
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    txOverrides: {}
  },
  '42161': {
    ...sharedChain.arbitrum,
    chainId: '42161',
    parentChainId: '1',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    fallbackRpcUrls: [
      'https://rpc.ankr.com/arbitrum',
      'https://arbitrum-mainnet.infura.io/v3/84842078b09946638c03157f83405213', // from ethers
    ],
    explorerUrls: ['https://arbiscan.io'],
    subgraphUrl: 'https://subgraph.hop.exchange/arbitrum',
    etherscanApiUrl: 'https://api.arbiscan.io',
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    txOverrides: {}
  },
  '10': {
    ...sharedChain.optimism,
    chainId: '10',
    parentChainId: '1',
    rpcUrl: 'https://1rpc.io/op',
    fallbackRpcUrls: [
      'https://optimism.drpc.org',
      'https://optimism-rpc.publicnode.com',
      'https://optimism.gateway.tenderly.co',
      //'https://rpc.ankr.com/optimism',
      'https://optimism-mainnet.infura.io/v3/84842078b09946638c03157f83405213', // from ethers
      'https://mainnet.optimism.io'
    ],
    explorerUrls: ['https://optimistic.etherscan.io'],
    subgraphUrl: 'https://subgraph.hop.exchange/optimism',
    etherscanApiUrl: 'https://api-optimistic.etherscan.io',
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    txOverrides: {}
  },
  '100': {
    ...sharedChain.gnosis,
    chainId: '100',
    parentChainId: '1',
    rpcUrl: 'https://rpc.gnosis.gateway.fm',
    fallbackRpcUrls: [
      'https://rpc.ankr.com/gnosis',
      'https://rpc.gnosischain.com'
    ],
    explorerUrls: ['https://gnosisscan.io'],
    // This is a placeholder subgraph URL. The API key will be removed
    subgraphUrl: 'https://subgraph.hop.exchange/gnosis',
    etherscanApiUrl: 'https://api.gnosisscan.io',
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    txOverrides: {
      minGasPrice: 1500000000 // 1.5 gwei
    }
  },
  '137': {
    ...sharedChain.polygon,
    chainId: '137',
    parentChainId: '1',
    rpcUrl: 'https://polygon-rpc.com',
    fallbackRpcUrls: [
      'https://rpc.ankr.com/polygon'
    ],
    explorerUrls: ['https://polygonscan.com'],
    subgraphUrl: 'https://subgraph.hop.exchange/polygon',
    etherscanApiUrl: 'https://api.polygonscan.com',
    txOverrides: {
      // Not all Polygon nodes follow recommended 30 Gwei gasPrice
      // https://forum.matic.network/t/recommended-min-gas-price-setting/2531
      minGasPrice: 30_000_000_000,
      minGasLimit: 1_000_000
    },
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11'
  },
  '42170': {
    ...sharedChain.nova,
    chainId: '42170',
    parentChainId: '1',
    rpcUrl: 'https://nova.arbitrum.io/rpc',
    fallbackRpcUrls: [],
    explorerUrls: ['https://nova.arbiscan.io'],
    subgraphUrl: 'https://subgraph.hop.exchange/nova',
    etherscanApiUrl: 'https://api-nova.arbiscan.io',
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    txOverrides: {}
  },
  '8453': {
    ...sharedChain.base,
    chainId: '8453',
    parentChainId: '1',
    rpcUrl: 'https://mainnet.base.org',
    fallbackRpcUrls: [],
    explorerUrls: ['https://basescan.org'],
    subgraphUrl: 'https://subgraph.hop.exchange/base',
    etherscanApiUrl: 'https://api.basescan.org',
    multicall: '0xca11bde05977b3631167028862be2a173976ca11',
    txOverrides: {}
  },
  '59144': {
    ...sharedChain.linea,
    chainId: '59144',
    parentChainId: '1',
    rpcUrl: 'https://rpc.linea.build',
    fallbackRpcUrls: [],
    explorerUrls: ['https://lineascan.build/'],
    subgraphUrl: 'https://subgraph.hop.exchange/linea',
    etherscanApiUrl: 'https://api.lineascan.build',
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    txOverrides: {}
  },
  '1101': {
    ...sharedChain.polygonzk,
    chainId: '1101',
    parentChainId: '1',
    rpcUrl: 'https://zkevm-rpc.com',
    fallbackRpcUrls: [],
    explorerUrls: ['https://zkevm.polygonscan.com/'],
    subgraphUrl: 'https://subgraph.hop.exchange/polygonzk',
    etherscanApiUrl: 'https://api-zkevm.polygonscan.com',
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    txOverrides: {}
  },
  // TODO: Update chainId so it does not overwrite the hub on Sepolia
  // '42069': {
  //   ...sharedChain.hub,
  //   chainId: '42069',
  //   parentChainId: '1',
  //   rpcUrl: '',
  //   fallbackRpcUrls: [],
  //   explorerUrls: [],
  //   multicall: '',
  //   subgraphUrl: '',
  //   etherscanApiUrl: '',
  //   isRollup: true,
  //   txOverrides: {}
  // }
}

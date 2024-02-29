import { Networks } from './types.js'
import { chains } from '../metadata/index.js'

export const networks: Networks = {
  ethereum: {
    name: chains.ethereum.name,
    image: chains.ethereum.image,
    networkId: 5,
    publicRpcUrl: 'https://goerli.infura.io/v3/84842078b09946638c03157f83405213', // from ethers
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://goerli.etherscan.io'],
    subgraphUrl: 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop-goerli',
    txOverrides: {
      minGasLimit: 1_000_000
    },
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    averageBlockTimeSeconds: 12,

    // These values are currently the same on both mainnet and testnet but this might not always be the case
    timeToIncludeOnL2Seconds: 0
  },
  polygon: {
    name: chains.polygon.name,
    image: chains.polygon.image,
    networkId: 80001,
    publicRpcUrl: 'https://rpc.ankr.com/polygon_mumbai',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://mumbai.polygonscan.com'],
    nativeBridgeUrl: 'https://wallet.matic.network/bridge',
    subgraphUrl: 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop-mumbai',
    txOverrides: {
      minGasPrice: 30_000_000_000,
      minGasLimit: 1_000_000
    },
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    averageBlockTimeSeconds: 2
  },
  optimism: {
    name: chains.optimism.name,
    image: chains.optimism.image,
    networkId: 420,
    publicRpcUrl: 'https://goerli.optimism.io',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://goerli-optimism.etherscan.io'],
    nativeBridgeUrl: 'https://app.optimism.io/bridge',
    subgraphUrl: 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop-optimism-goerli',
    isRollup: true,
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    averageBlockTimeSeconds: 2,
    oruExitTimeSeconds: 60 * 60, // 1 hour

    // These values are currently the same on both mainnet and testnet but this might not always be the case
    timeToIncludeOnL1Seconds: 120,
    timeToIncludeOnL2Seconds: 180,
    L1ToL2CheckpointTimeInL1Blocks: 6
  },
  arbitrum: {
    name: chains.arbitrum.name,
    image: chains.arbitrum.image,
    networkId: 421613,
    publicRpcUrl: 'https://goerli-rollup.arbitrum.io/rpc',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://goerli.arbiscan.io/'],
    nativeBridgeUrl: 'https://bridge.arbitrum.io',
    subgraphUrl: 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop-arbitrum-goerli',
    isRollup: true,
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11'
  },
  zksync: {
    name: chains.zksync.name,
    image: chains.zksync.image,
    networkId: 280,
    publicRpcUrl: 'https://zksync2-testnet.zksync.dev',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://goerli.explorer.zksync.io', 'https://zksync2-testnet.zkscan.io'],
    nativeBridgeUrl: '',
    isRollup: true,
    multicall: '0xF9cda624FBC7e059355ce98a31693d299FACd963'
  },
  linea: {
    name: chains.linea.name,
    image: chains.linea.image,
    networkId: 59140,
    publicRpcUrl: 'https://rpc.goerli.linea.build',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://explorer.goerli.linea.build'],
    nativeBridgeUrl: 'https://bridge.goerli.linea.build',
    subgraphUrl: 'https://linea-goerli.subgraph.hop.exchange/subgraphs/name/hop-protocol/hop-linea-goerli',
    isRollup: true,
    isRelayable: true,
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
    averageBlockTimeSeconds: 12,
    oruExitTimeSeconds: 12 * 60 * 60 // 12 hours
  },
  scrollzk: {
    name: chains.scrollzk.name,
    image: chains.scrollzk.image,
    networkId: 534354,
    publicRpcUrl: 'https://prealpha-rpc.scroll.io/l2',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://l2scan.scroll.io'],
    nativeBridgeUrl: 'https://scroll.io/prealpha/bridge',
    isRollup: true,
    multicall: '0xcA11bde05977b3631167028862bE2a173976CA11'
  },
  base: {
    name: chains.base.name,
    image: chains.base.image,
    networkId: 84531,
    publicRpcUrl: 'https://goerli.base.org',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://goerli.basescan.org'],
    nativeBridgeUrl: 'https://bridge.base.org',
    subgraphUrl: 'https://base-goerli.subgraph.hop.exchange/subgraphs/name/hop-protocol/hop-base-goerli',
    isRollup: true,
    multicall: '0xca11bde05977b3631167028862be2a173976ca11',
    averageBlockTimeSeconds: 2,
    oruExitTimeSeconds: 60 * 60, // 1 hour

    // These values are currently the same on both mainnet and testnet but this might not always be the case
    timeToIncludeOnL1Seconds: 20,
    timeToIncludeOnL2Seconds: 90,
    L1ToL2CheckpointTimeInL1Blocks: 12
  },
  polygonzk: {
    name: chains.polygonzk.name,
    image: chains.polygonzk.image,
    networkId: 1442,
    publicRpcUrl: 'https://rpc.public.zkevm-test.net',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://explorer.public.zkevm-test.net'],
    nativeBridgeUrl: 'https://public.zkevm-test.net',
    isRollup: true,
    isRelayable: true,
    multicall: '0xca11bde05977b3631167028862be2a173976ca11',

    // PolygonZk: typically around 30 minutes but up to a week in rare cases.
    //           https://zkevm.polygon.technology/docs/protocol/transaction-execution
    oruExitTimeSeconds: 60 * 60 // 1 hour
  }
}

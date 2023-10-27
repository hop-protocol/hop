import { BaseChainData } from './shared'
import { Networks } from './types'

export const networks: Networks = {
  ethereum: {
    name: BaseChainData.ethereum.name,
    image: BaseChainData.ethereum.image,
    networkId: 5,
    publicRpcUrl: 'https://goerli.infura.io/v3/84842078b09946638c03157f83405213', // from ethers
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://goerli.etherscan.io'],
    subgraphUrl: 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop-goerli'
  },
  polygon: {
    name: BaseChainData.polygon.name,
    image: BaseChainData.polygon.image,
    networkId: 80001,
    publicRpcUrl: 'https://rpc.ankr.com/polygon_mumbai',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://mumbai.polygonscan.com'],
    nativeBridgeUrl: 'https://wallet.matic.network/bridge',
    subgraphUrl: 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop-mumbai'
  },
  optimism: {
    name: BaseChainData.optimism.name,
    image: BaseChainData.optimism.image,
    networkId: 420,
    publicRpcUrl: 'https://goerli.optimism.io',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://goerli-optimism.etherscan.io'],
    nativeBridgeUrl: 'https://app.optimism.io/bridge',
    subgraphUrl: 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop-optimism-goerli'
  },
  arbitrum: {
    name: BaseChainData.arbitrum.name,
    image: BaseChainData.arbitrum.image,
    networkId: 421613,
    publicRpcUrl: 'https://goerli-rollup.arbitrum.io/rpc',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://goerli.arbiscan.io'],
    nativeBridgeUrl: 'https://bridge.arbitrum.io',
    subgraphUrl: 'https://arbitrum-goerli.subgraph.hop.exchange/subgraphs/name/hop-protocol/hop-arbitrum-goerli'
  },
  zksync: {
    name: BaseChainData.zksync.name,
    image: BaseChainData.zksync.image,
    networkId: 280,
    publicRpcUrl: 'https://zksync2-testnet.zksync.dev',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://goerli.explorer.zksync.io', 'https://zksync2-testnet.zkscan.io'],
    nativeBridgeUrl: ''
  },
  linea: {
    name: BaseChainData.linea.name,
    image: BaseChainData.linea.image,
    networkId: 59140,
    publicRpcUrl: 'https://rpc.goerli.linea.build',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://explorer.goerli.linea.build'],
    nativeBridgeUrl: 'https://bridge.goerli.linea.build',
    subgraphUrl: 'https://linea-goerli.subgraph.hop.exchange/subgraphs/name/hop-protocol/hop-linea-goerli'
  },
  scrollzk: {
    name: BaseChainData.scrollzk.name,
    image: BaseChainData.scrollzk.image,
    networkId: 534354,
    publicRpcUrl: 'https://prealpha-rpc.scroll.io/l2',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://l2scan.scroll.io'],
    nativeBridgeUrl: 'https://scroll.io/prealpha/bridge'
  },
  base: {
    name: BaseChainData.base.name,
    image: BaseChainData.base.image,
    networkId: 84531,
    publicRpcUrl: 'https://goerli.base.org',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://goerli.basescan.org'],
    nativeBridgeUrl: 'https://bridge.base.org',
    subgraphUrl: 'https://base-goerli.subgraph.hop.exchange/subgraphs/name/hop-protocol/hop-base-goerli'
  },
  polygonzk: {
    name: BaseChainData.polygonzk.name,
    image: BaseChainData.polygonzk.image,
    networkId: 1442,
    publicRpcUrl: 'https://rpc.public.zkevm-test.net',
    fallbackPublicRpcUrls: [],
    explorerUrls: ['https://explorer.public.zkevm-test.net'],
    nativeBridgeUrl: 'https://public.zkevm-test.net'
  }
}

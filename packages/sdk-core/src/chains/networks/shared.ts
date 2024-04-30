import { ChainSlug, type SharedChains } from '../types.js'
import { TokenSymbol } from '#tokens/index.js'
import * as assets from '../assets/index.js'

// A parentChainId of 0 indicates that the chain is an L1 chain
export const NO_PARENT_CHAIN_ID = 0

/**
 * Some chains have a variable block time with a single tx per block. Use
 * 250ms for these chains as an approximation, following the lead
 * of https://www.rollup.codes/
 */
const BLOCK_TIME_FOR_SINGLE_TX_BLOCKS_MS = 250

/**
 * Represents data that is shared across chains on all networks
 */

export const sharedChain: SharedChains = {
  ethereum: {
    name: 'Ethereum',
    slug: ChainSlug.Ethereum,
    image: assets.ethereumImage,
    nativeTokenSymbol: TokenSymbol.ETH,
    primaryColor: '#868dac',
    isL1: true,
    isRollup: false,
    isManualRelayOnL2: false,
    averageBlockTimeMs: 12_000
  },
  gnosis: {
    name: 'Gnosis',
    slug: ChainSlug.Gnosis,
    image: assets.gnosisImage,
    nativeTokenSymbol: TokenSymbol.XDAI,
    primaryColor: '#46a4a1',
    isL1: false,
    isRollup: false,
    isManualRelayOnL2: false,
    averageBlockTimeMs: 5_000
  },
  polygon: {
    name: 'Polygon',
    slug: ChainSlug.Polygon,
    image: assets.polygonImage,
    nativeTokenSymbol: TokenSymbol.MATIC,
    primaryColor: '#8b57e1',
    isL1: false,
    isRollup: false,
    isManualRelayOnL2: false,
    averageBlockTimeMs: 2_000
  },
  arbitrum: {
    name: 'Arbitrum One',
    slug: ChainSlug.Arbitrum,
    image: assets.arbitrumImage,
    nativeTokenSymbol: TokenSymbol.ETH,
    primaryColor: '#289fef',
    isL1: false,
    isRollup: true,
    isManualRelayOnL2: true,
    averageBlockTimeMs: BLOCK_TIME_FOR_SINGLE_TX_BLOCKS_MS
  },
  optimism: {
    name: 'Optimism',
    slug: ChainSlug.Optimism,
    image: assets.optimismImage,
    nativeTokenSymbol: TokenSymbol.ETH,
    primaryColor: '#e64b5d',
    isL1: false,
    isRollup: true,
    isManualRelayOnL2: false,
    averageBlockTimeMs: 2_000
  },
  nova: {
    name: 'Arbitrum Nova',
    slug: ChainSlug.Nova,
    image: assets.novaImage,
    nativeTokenSymbol: TokenSymbol.ETH,
    primaryColor: '#ec772c',
    isL1: false,
    isRollup: true,
    isManualRelayOnL2: true,
    averageBlockTimeMs: BLOCK_TIME_FOR_SINGLE_TX_BLOCKS_MS
  },
  zksync: {
    name: 'zkSync',
    slug: ChainSlug.ZkSync,
    image: assets.zksyncImage,
    nativeTokenSymbol: TokenSymbol.ETH,
    primaryColor: '#8889f4',
    isL1: false,
    isRollup: true,
    isManualRelayOnL2: true,
    averageBlockTimeMs: BLOCK_TIME_FOR_SINGLE_TX_BLOCKS_MS
  },
  linea: {
    name: 'Linea',
    slug: ChainSlug.Linea,
    image: assets.lineaImage,
    nativeTokenSymbol: TokenSymbol.ETH,
    primaryColor: '#121212',
    isL1: false,
    isRollup: true,
    isManualRelayOnL2: true,
    averageBlockTimeMs: 3_000
  },
  scrollzk: {
    name: 'Scroll zkEVM',
    slug: ChainSlug.ScrollZk,
    image: assets.scrollzkImage,
    nativeTokenSymbol: TokenSymbol.ETH,
    primaryColor: '#e5d1b8',
    isL1: false,
    isRollup: true,
    isManualRelayOnL2: true,
    averageBlockTimeMs: 3_000
  },
  base: {
    name: 'Base',
    slug: ChainSlug.Base,
    image: assets.baseImage,
    nativeTokenSymbol: TokenSymbol.ETH,
    primaryColor: '#0052ff',
    isL1: false,
    isRollup: true,
    isManualRelayOnL2: false,
    averageBlockTimeMs: 2_000
  },
  polygonzk: {
    name: 'Polygon zkEVM',
    slug: ChainSlug.PolygonZk,
    image: assets.polygonzkImage,
    nativeTokenSymbol: TokenSymbol.ETH,
    primaryColor: '#8b57e1',
    isL1: false,
    isRollup: true,
    isManualRelayOnL2: true,
    averageBlockTimeMs: 3_000
  }
}

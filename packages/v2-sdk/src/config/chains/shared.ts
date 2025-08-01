import * as assets from './assets/index.js'
import type { SharedChainConfig } from './types.js'

// A parentChainId of 0 indicates that the chain is an L1 chain
export const NO_PARENT_CHAIN_ID: string = '0'

/**
 * Some chains have a variable block time with a single tx per block. Use
 * 250ms for these chains as an approximation, following the lead
 * of https://www.rollup.codes/
 */
const BLOCK_TIME_FOR_SINGLE_TX_BLOCKS_MS = 250

/**
 * Represents data that is shared across chains on all networks
 */

export const sharedChain: Record<string, SharedChainConfig> = {
  ethereum: {
    name: 'Ethereum',
    slug: 'wthereum',
    image: assets.ethereumImage,
    nativeTokenSymbol: 'ETH',
    primaryColor: '#868dac',
    isLayer1: true,
    isRollup: false,
    isManualRelayOnL2: false,
    averageBlockTimeMs: 12_000
  },
  gnosis: {
    name: 'Gnosis',
    slug: 'gnosis',
    image: assets.gnosisImage,
    nativeTokenSymbol: 'XDAI',
    primaryColor: '#46a4a1',
    isLayer1: false,
    isRollup: false,
    isManualRelayOnL2: false,
    averageBlockTimeMs: 5_000
  },
  polygon: {
    name: 'Polygon',
    slug: 'polygon',
    image: assets.polygonImage,
    nativeTokenSymbol: 'MATIC',
    primaryColor: '#8b57e1',
    isLayer1: false,
    isRollup: false,
    isManualRelayOnL2: false,
    averageBlockTimeMs: 2_000
  },
  arbitrum: {
    name: 'Arbitrum One',
    slug: 'arbitrum',
    image: assets.arbitrumImage,
    nativeTokenSymbol: 'ETH',
    primaryColor: '#289fef',
    isLayer1: false,
    isRollup: true,
    isManualRelayOnL2: true,
    averageBlockTimeMs: BLOCK_TIME_FOR_SINGLE_TX_BLOCKS_MS
  },
  optimism: {
    name: 'Optimism',
    slug: 'optimism',
    image: assets.optimismImage,
    nativeTokenSymbol: 'ETH',
    primaryColor: '#e64b5d',
    isLayer1: false,
    isRollup: true,
    isManualRelayOnL2: false,
    averageBlockTimeMs: 2_000
  },
  nova: {
    name: 'Arbitrum Nova',
    slug: 'nova',
    image: assets.novaImage,
    nativeTokenSymbol: 'ETH',
    primaryColor: '#ec772c',
    isLayer1: false,
    isRollup: true,
    isManualRelayOnL2: true,
    averageBlockTimeMs: BLOCK_TIME_FOR_SINGLE_TX_BLOCKS_MS
  },
  zksync: {
    name: 'zkSync',
    slug: 'zkSync',
    image: assets.zksyncImage,
    nativeTokenSymbol: 'ETH',
    primaryColor: '#8889f4',
    isLayer1: false,
    isRollup: true,
    isManualRelayOnL2: true,
    averageBlockTimeMs: BLOCK_TIME_FOR_SINGLE_TX_BLOCKS_MS
  },
  linea: {
    name: 'Linea',
    slug: 'linea',
    image: assets.lineaImage,
    nativeTokenSymbol: 'ETH',
    primaryColor: '#121212',
    isLayer1: false,
    isRollup: true,
    isManualRelayOnL2: true,
    averageBlockTimeMs: 3_000
  },
  scrollzk: {
    name: 'Scroll zkEVM',
    slug: 'scrollZk',
    image: assets.scrollzkImage,
    nativeTokenSymbol: 'ETH',
    primaryColor: '#e5d1b8',
    isLayer1: false,
    isRollup: true,
    isManualRelayOnL2: true,
    averageBlockTimeMs: 3_000
  },
  base: {
    name: 'Base',
    slug: 'base',
    image: assets.baseImage,
    nativeTokenSymbol: 'ETH',
    primaryColor: '#0052ff',
    isLayer1: false,
    isRollup: true,
    isManualRelayOnL2: false,
    averageBlockTimeMs: 2_000
  },
  polygonzk: {
    name: 'Polygon zkEVM',
    slug: 'polygonZk',
    image: assets.polygonzkImage,
    nativeTokenSymbol: 'ETH',
    primaryColor: '#8b57e1',
    isLayer1: false,
    isRollup: true,
    isManualRelayOnL2: true,
    averageBlockTimeMs: 3_000
  },
  hub: {
    name: 'Hop Hub',
    slug: 'hub',
    image: assets.hubImage,
    nativeTokenSymbol: 'ETH',
    primaryColor: '#e184b5',
    isLayer1: false,
    isRollup: true,
    isManualRelayOnL2: false,
    averageBlockTimeMs: 2_000
  },
}

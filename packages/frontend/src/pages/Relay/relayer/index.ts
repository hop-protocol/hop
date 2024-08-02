import type { providers, Signer } from 'ethers'
import { NetworkSlug, ChainSlug } from '@hop-protocol/sdk'

export { MessageDirection } from './types.js'
import { PolygonRelayer } from './PolygonRelayer.js'
import { PolygonZkRelayer } from './PolygonZkRelayer.js'
import { OptimismRelayer } from './OptimismRelayer.js'
import { ArbitrumRelayer } from './ArbitrumRelayer.js'
import { GnosisRelayer } from './GnosisRelayer.js'
// import { LineaRelayer } from './LineaRelayer.js'

export { PolygonRelayer }
export { PolygonZkRelayer }
export { OptimismRelayer }
export { ArbitrumRelayer}
export { GnosisRelayer }
// export { LineaRelayer }

type Provider = providers.Provider

export function getRelayer (networkSlug: NetworkSlug, chainSlug: ChainSlug, l1Wallet: Signer | Provider, l2Wallet: Signer | Provider) {
  if (chainSlug === ChainSlug.Polygon) {
    return new PolygonRelayer(networkSlug, chainSlug, l1Wallet, l2Wallet)
  } else if (chainSlug === ChainSlug.PolygonZk) {
    return new PolygonZkRelayer(networkSlug, chainSlug, l1Wallet, l2Wallet)
  } else if (chainSlug === ChainSlug.Optimism || chainSlug === ChainSlug.Base) {
    return new OptimismRelayer(networkSlug, chainSlug, l1Wallet, l2Wallet)
  } else if (chainSlug === ChainSlug.Gnosis) {
    return new GnosisRelayer(networkSlug, chainSlug, l1Wallet, l2Wallet)
  } else if (chainSlug === ChainSlug.Arbitrum || chainSlug === ChainSlug.Nova) {
    return new ArbitrumRelayer(networkSlug, chainSlug, l1Wallet, l2Wallet)
  // } else if (chainSlug === ChainSlug.Linea) {
  //   return new LineaRelayer(networkSlug, chainSlug, l1Wallet, l2Wallet)
  }

  throw new Error(`unsupported chainSlug: ${chainSlug}`)
}

export { getTransferCommittedEventForTransferId } from './theGraph.js'

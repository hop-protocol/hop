import type { providers, Signer } from 'ethers'

export { MessageDirection } from './types.js'
import { PolygonRelayer } from './PolygonRelayer.js'
import { PolygonZkRelayer } from './PolygonZkRelayer.js'
import { OptimismRelayer } from './OptimismRelayer.js'
// import { ArbitrumRelayer } from './ArbitrumRelayer.js'
import { GnosisRelayer } from './GnosisRelayer.js'
// import { LineaRelayer } from './LineaRelayer.js'

export { PolygonRelayer }
export { PolygonZkRelayer }
export { OptimismRelayer }
// export { ArbitrumRelayer}
export { GnosisRelayer }
// export { LineaRelayer }

export function getRelayer (networkSlug: string, chainSlug: string, l1Wallet: Signer | providers.Provider, l2Wallet: Signer | providers.Provider) {
  if (chainSlug === 'polygon') {
    return new PolygonRelayer(networkSlug, l1Wallet, l2Wallet)
  } else if (chainSlug === 'polygonzk') {
    return new PolygonZkRelayer(networkSlug, l1Wallet, l2Wallet)
  } else if (chainSlug === 'optimism' || chainSlug === 'base') {
    return new OptimismRelayer(networkSlug, l1Wallet, l2Wallet)
  } else if (chainSlug === 'gnosis') {
    return new GnosisRelayer(networkSlug, l1Wallet, l2Wallet)
  }
  // } else if (chainSlug === 'linea') {
  //   return new LineaRelayer(networkSlug, l1Wallet, l2Wallet)
  // }
  // } else if (chainSlug === 'arbitrum' || chainSlug === 'nova') {
  //   return new ArbitrumRelayer(networkSlug, chainSlug, l1Wallet, l2Wallet)
  // }

  throw new Error(`unsupported chainSlug: ${chainSlug}`)
}

import { Hop } from './Hop.js'
export { Hop }
export { HopBridge } from './HopBridge.js'
export { AMM } from './AMM.js'
export { Token } from './Token.js'
export { Base } from './Base.js'
export { RelayerFee } from './relayerFee/index.js'
export {
  TChain,
  TToken,
  TAmount,
  TTime,
  TTimeSlot,
  TProvider
} from './types.js'
export {
  ChainSlug,
  ChainName,
  Slug,
  NetworkSlug,
  ChainId,
  CanonicalToken,
  WrappedToken,
  HToken,
  eventTopics
} from './constants/index.js'

export * from './models/index.js'
export * from './contracts/index.js'

export { type Bps, sdkConfig } from './config/index.js'
export {
  getLpFeeBps
} from './utils/index.js'

export {
  Chain,
  ChainSlugish,
  Multicall,
  PriceFeed,
  RetryProvider,
  RpcProvider,
  FallbackProvider,
  TokenSymbol,
  chainIdToSlug,
  fetchJsonOrThrow,
  getChain,
  getChains,
  getToken,
  getTokens,
  getNetwork,
  getNetworks,
  getMinGasLimit,
  getMinGasPrice,
  getUrlFromProvider,
  promiseQueue,
  promiseTimeout,
  rateLimitRetry,
  serializeQueryParams,
  shiftBNDecimals,
  rpcProviders,
  RpcProviderSlug
} from '@hop-protocol/sdk-core'

export { TokenModel } from '#models/index.js'
export { getProviderFromUrl, getTokenDecimals } from '#utils/index.js'

if (typeof window !== 'undefined') {
  (window as any).Hop = Hop
}

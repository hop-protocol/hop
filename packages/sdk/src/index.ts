import Hop from './Hop'
export { Hop }
export { default as HopBridge } from './HopBridge'
export { default as AMM } from './AMM'
export { default as Token } from './Token'
export { default as Base } from './Base'

export { RelayerFee } from './relayerFee'

import { utils } from '@hop-protocol/sdk-core'
export { Multicall, GetMulticallBalanceOptions, models, PriceFeed, priceFeed, RetryProvider, FallbackProvider } from '@hop-protocol/sdk-core'

const { WithdrawalProof } = utils
export { utils, WithdrawalProof }

export * from './types'
export { eventTopics } from './constants'
export {
  ChainSlug,
  ChainName,
  Slug,
  NetworkSlug,
  ChainId,
  TokenSymbol,
  CanonicalToken,
  WrappedToken,
  HToken
} from './constants/constants'

if (typeof window !== 'undefined') {
  (window as any).Hop = Hop
}

import { CanonicalToken, ChainId, ChainName, ChainSlug, HToken, NetworkSlug, Slug, WrappedToken } from '@hop-protocol/core/networks/enums'

export { NetworkSlug, ChainId, ChainName, ChainSlug, Slug, CanonicalToken, WrappedToken, HToken }

export type TokenSymbol = CanonicalToken | WrappedToken | HToken | string

export enum TokenIndex {
  CanonicalToken = 0,
  HopBridgeToken = 1
}

export enum BondTransferGasLimit {
  Ethereum = '165000',
  Optimism = '350000',
  Arbitrum = '2500000',
  Nova = '2500000',
  Base = '350000',
  Linea = '350000'
}

export const SettlementGasLimitPerTx: Record<string, number> = {
  ethereum: 5141,
  polygon: 5933,
  gnosis: 3218,
  optimism: 8545,
  arbitrum: 19843,
  nova: 19843,
  base: 8545,
  zksync: 10000, // TODO
  linea: 10000, // TODO
  scrollzk: 10000, // TODO
  polygonzk: 10000 // TODO
}

export const LpFeeBps = 4
export const PendingAmountBufferUsd = 50000

export enum Errors {
  NotEnoughAllowance = 'Not enough allowance. Please call `approve` on the token contract to allow contract to move tokens and make sure you are connected to the correct network.',
  xDaiRebrand = 'NOTICE: xDai has been rebranded to Gnosis. Chain "xdai" is deprecated. Use "gnosis" instead.'
}

export enum EventNames {
  TransferSent = 'TransferSent',
  TransferSentToL2 = 'TransferSentToL2',
}

export const MaxDeadline: number = 9999999999
// Low liquidity or single-chain tokens should have a buffer of appx 10% of their L1 stake
export const LowLiquidityTokens: string[] = ['HOP', 'SNX', 'sUSD', 'rETH']
export const LowLiquidityTokenBufferAmountsUsd: Record<string, string> = {
  HOP: '8000',
  SNX: '40000',
  sUSD: '40000',
  rETH: '50000'
}
export const SecondsInDay = 86400

import { CanonicalToken, ChainId, ChainName, ChainSlug, Errors, NetworkSlug, Slug, TokenSymbol as TokenSymbolCore, WrappedToken } from '@hop-protocol/sdk-core'
import { HToken } from '#networks/index.js'

type TokenSymbol = TokenSymbolCore | HToken

export { Errors, TokenSymbol, NetworkSlug, ChainId, ChainName, ChainSlug, Slug, CanonicalToken, WrappedToken }

export enum TokenIndex {
  CanonicalToken = 0,
  HopBridgeToken = 1
}

export enum BondTransferGasLimit {
  Ethereum = '165000',
   
  Optimism = '350000',
   
  Arbitrum = '2500000',
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  Nova = '2500000',
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  Base = '350000',
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
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
  linea: 10416,
  scrollzk: 10000, // TODO
  polygonzk: 6270
}

export const PendingAmountBufferUsd = 50000

export enum EventNames {
  TransferSent = 'TransferSent',
  TransferSentToL2 = 'TransferSentToL2',
}

export const MaxDeadline: number = 9999999999
// Low liquidity or single-chain tokens should have a buffer of appx 10% of their L1 stake
export const LowLiquidityTokens: string[] = ['USDT', 'HOP', 'SNX', 'sUSD', 'rETH']
export const LowLiquidityTokenBufferAmountsUsd: Record<string, string> = {
  USDT: '10000',
  HOP: '8000',
  SNX: '40000',
  sUSD: '40000',
  rETH: '50000'
}
export const SecondsInDay = 86400

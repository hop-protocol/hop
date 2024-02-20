import { ChainSlug as Chain } from '@hop-protocol/core/networks'
// TODO: MIGRATION: Handle this
// i think get this from hnc package
import { OneHourMs } from '@hop-protocol/hop-node-core/constants'
import { RpcProviderSlug, rpcProviders } from '@hop-protocol/core/metadata'

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

export const RootSetSettleDelayMs = 5 * 60 * 1000
export const ChallengePeriodMs = 24 * OneHourMs

export const MaxInt32 = 2147483647

export enum TxError {
  CallException = 'CALL_EXCEPTION',
  BonderFeeTooLow = 'BONDER_FEE_TOO_LOW',
  RelayerFeeTooLow = 'RELAYER_FEE_TOO_LOW',
  NotEnoughLiquidity = 'NOT_ENOUGH_LIQUIDITY',
  RedundantRpcOutOfSync = 'REDUNDANT_RPC_OUT_OF_SYNC',
  RpcServerError = 'RPC_SERVER_ERROR',
  UnfinalizedTransferBondError = 'UNFINALIZED_TRANSFER_BOND_ERROR',
  MessageUnknownStatus = 'MESSAGE_UNKNOWN_STATUS',
  MessageRelayTooEarly = 'MESSAGE_RELAY_TOO_EARLY',
  MessageAlreadyRelayed = 'MESSAGE_ALREADY_RELAYED',
  MessageInvalidState = 'MESSAGE_INVALID_STATE'
}

export enum TokenIndex {
  CanonicalToken = 0,
  HopBridgeToken = 1,
}

export enum GasCostTransactionType {
  BondWithdrawal = 'bondWithdrawal',
  BondWithdrawalAndAttemptSwap = 'bondWithdrawalAndAttemptSwap',
  Relay = 'relay'
}

export const MaxDeadline: number = 9999999999

export const BondTransferRootDelayBufferSeconds = 5 * 60
export const MaxReorgCheckBackoffIndex = 2 // 120 + 240 + 480 = 840 seconds, 14 minutes

// Poll certain chains at a slower cadence if they are not widely used
export const ChainPollMultiplier: Record<string, number> = {
  [Chain.Ethereum]: 1,
  [Chain.Gnosis]: 2,
  [Chain.Polygon]: 2,
  [Chain.Optimism]: 1,
  [Chain.Arbitrum]: 1,
  [Chain.Base]: 1,
  [Chain.Nova]: 2,
  [Chain.Linea]: 1,
  [Chain.PolygonZk]: 1
}

const DoesRootProviderSupportWs: Partial<Record<RpcProviderSlug, boolean>> = {}

for (const providerSlug in rpcProviders) {
  const providerObj = rpcProviders[providerSlug as RpcProviderSlug]
  DoesRootProviderSupportWs[providerSlug as RpcProviderSlug] = providerObj?.wsSupported
}

export { DoesRootProviderSupportWs }
export { RpcProviderSlug as RootProviderName }

export const DefaultBondThreshold = 5
// TODO: When bonder-specific strategies are isolated from the finality dir, use a new
// SyncType const defined there
export enum SyncType {
  Bonder = 'bonder',
  Collateralized = 'collateralized',
  Threshold = 'threshold'
}

/// ///////
// TODO: Convert this to chainTimingMetadata in core with length or finality status
/// ///////

type IRelayableChains = {
  L1_TO_L2: string[]
  L2_TO_L1: string[]
}

export const RelayableChains: IRelayableChains = {
  L1_TO_L2: [
    Chain.Arbitrum,
    Chain.Nova,
    Chain.Linea,
    Chain.PolygonZk
  ],
  L2_TO_L1: [
    Chain.Gnosis,
    Chain.Polygon,
    Chain.PolygonZk
  ]
}

type IRelayableWaitTimeMs = {
  L1_TO_L2: {
    [chain: string]: number
  }
  L2_TO_L1: {
    [chain: string]: number
  }
}
export const RelayWaitTimeMs: IRelayableWaitTimeMs = {
  L1_TO_L2: {
    [Chain.Arbitrum]: 15 * 60 * 1000, // L1 safe
    [Chain.Nova]: 15 * 60 * 1000, // L1 safe
    [Chain.Linea]: 25 * 60 * 1000, // L1 finalized
    [Chain.PolygonZk]: 15 * 60 * 1000 // 32 L1 Blocks + buffer
  },
  L2_TO_L1: {
    [Chain.Gnosis]: 1 * OneHourMs,
    [Chain.Polygon]: 1 * OneHourMs,
    [Chain.PolygonZk]: 1 * OneHourMs
  }
}

export const BondTransferRootChains: string[] = [
  Chain.Optimism,
  Chain.Arbitrum,
  Chain.Nova,
  Chain.Base,
  Chain.Linea
]

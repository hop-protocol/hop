import { TokenSymbolish, ChainSlug } from '@hop-protocol/sdk-core'

export type Bps = {
  [key in ChainSlug]: number
}

export type Fees = {
  [key in TokenSymbolish]: Partial<Bps>
}

export type RelayerFeeWei = {
  [key in ChainSlug]: string
}

export type RelayerFeeEnabled = {
  [key in ChainSlug]: boolean
}

export type BridgeDeprecated = {
  [key in TokenSymbolish]: boolean
}

export type TotalStake = {
  [key in TokenSymbolish]: number
}

export type DefaultSendGasLimit = {
  native: Partial<{
    [key in ChainSlug]: number
  }>,
  token: Partial<{
    [key in ChainSlug]: number
  }>
}

export type Config = {
  bonderFeeBps: Partial<Fees>
  bonderTotalStake: Partial<TotalStake>
  destinationFeeGasPriceMultiplier: number
  relayerFeeWei: Partial<RelayerFeeWei>
  relayerFeeEnabled: Partial<RelayerFeeEnabled>
  bridgeDeprecated: Partial<BridgeDeprecated>
  defaultSendGasLimit: Partial<DefaultSendGasLimit>
}

import { sdkConfig } from '@hop-protocol/sdk-core/config'
import { addresses as chainAddresses } from '#addresses/index.js'
import { networks as chainNetworks } from '#networks/index.js'

import { config as goerli } from './goerli.js'
import { config as mainnet } from './mainnet.js'
import { config as sepolia } from './sepolia.js'

const config: any = { goerli, sepolia, mainnet }
for (const network in chainNetworks) {
  const addresses = (chainAddresses as any)[network].bridges
  const bonders = (chainAddresses as any)[network].bonders
  const bonderFeeBps = (config as any)[network].bonderFeeBps
  const bonderTotalStake = (config as any)[network].bonderTotalStake
  const destinationFeeGasPriceMultiplier = (config as any)[network].destinationFeeGasPriceMultiplier
  const relayerFeeEnabled = (config as any)[network].relayerFeeEnabled
  const relayerFeeWei = (config as any)[network].relayerFeeWei
  const bridgeDeprecated = (config as any)[network].bridgeDeprecated
  const defaultSendGasLimit = (config as any)[network].defaultSendGasLimit
  sdkConfig[network] = {
    ...sdkConfig[network],
    addresses,
    bonders,
    bonderFeeBps,
    bonderTotalStake,
    destinationFeeGasPriceMultiplier,
    relayerFeeEnabled,
    relayerFeeWei,
    bridgeDeprecated,
    defaultSendGasLimit,
  }
}

export {
  config,
  goerli,
  sepolia,
  mainnet,
  sdkConfig
}

export {
  Bps,
  Fees,
  RelayerFeeWei,
  RelayerFeeEnabled,
  BridgeDeprecated,
  TotalStake,
  DefaultSendGasLimit,
  Config
} from './types.js'

export {
  ChainSlug,
  AssetSymbol,
  FinalityState,
  Chains,
  sdkMetadata as metadata,
  bondableChains,
  rateLimitMaxRetries,
  rpcTimeoutSeconds,
} from '@hop-protocol/sdk-core/config'

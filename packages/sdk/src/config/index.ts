import { NetworkSlug, getNetwork } from '@hop-protocol/sdk-core'
import { addresses as chainAddresses } from '#addresses/index.js'

import { config as goerli } from './goerli.js'
import { config as mainnet } from './mainnet.js'
import { config as sepolia } from './sepolia.js'

let sdkConfig: any
const bondableChainsSet = new Set<string>([])
const config: any = { goerli, sepolia, mainnet }
for (const network in Object.values(NetworkSlug)) {
  // Network Config
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

  // Bondable Chains
  const networkData = getNetwork(network)
  const networkChains = networkData.chains
  for (const chainData of Object.values(networkChains)) {
    if (chainData.isRollup) {
      bondableChainsSet.add(chainData.slug)
    }
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
  TokenSymbol
} from '@hop-protocol/sdk-core'

export const bondableChains = Array.from(bondableChainsSet)
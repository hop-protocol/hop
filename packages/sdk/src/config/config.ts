import { Chains } from './types'
import { addresses as chainAddresses } from '@hop-protocol/core/addresses'
import { networks as chainNetworks } from '@hop-protocol/core/networks'
import { config as coreConfig } from '@hop-protocol/core/config'
import { metadata } from './metadata'

const bondableChainsSet = new Set([])
const config : any = {}
for (const network in chainNetworks) {
  const chains: Chains = {}

  for (const chain in (chainNetworks as any)[network]) {
    const chainConfig = (chainNetworks as any)[network][chain] as any
    if (!chains[chain]) {
      chains[chain] = {}
    }
    chains[chain].name = chainConfig?.name
    chains[chain].chainId = chainConfig?.networkId
    chains[chain].rpcUrl = chainConfig?.publicRpcUrl
    chains[chain].explorerUrl = chainConfig?.explorerUrls?.[0]
    chains[chain].fallbackRpcUrls = chainConfig?.fallbackPublicRpcUrls ?? []
    chains[chain].etherscanApiUrl = chainConfig?.etherscanApiUrl ?? ''
    chains[chain].subgraphUrl = chainConfig?.subgraphUrl
    chains[chain].multicall = chainConfig?.multicall
    if (chainConfig?.isRollup) {
      bondableChainsSet.add(chain)
    }
  }

  const addresses = (chainAddresses as any)[network].bridges
  const bonders = (chainAddresses as any)[network].bonders
  const bonderFeeBps = (coreConfig as any)[network].bonderFeeBps
  const destinationFeeGasPriceMultiplier = (coreConfig as any)[network].destinationFeeGasPriceMultiplier
  const relayerFeeEnabled = (coreConfig as any)[network].relayerFeeEnabled
  const relayerFeeWei = (coreConfig as any)[network].relayerFeeWei
  const bridgeDeprecated = (coreConfig as any)[network].bridgeDeprecated

  config[network] = {
    addresses,
    chains,
    bonders,
    bonderFeeBps,
    destinationFeeGasPriceMultiplier,
    relayerFeeEnabled,
    relayerFeeWei,
    bridgeDeprecated
  }
}

export const bondableChains = Array.from(bondableChainsSet)
export const rateLimitMaxRetries = 3
export const rpcTimeoutSeconds = 60

export { metadata, config }

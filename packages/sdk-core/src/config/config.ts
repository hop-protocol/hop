import { addresses as chainAddresses } from '@hop-protocol/core/addresses'
import { networks as chainNetworks } from '@hop-protocol/core/networks'
import { chains as chainsMetadata, tokens as tokensMetadata } from '@hop-protocol/core/metadata'
import { config as coreConfig } from '@hop-protocol/core/config'

interface Chain {
  name: string
  chainId: number
  rpcUrl: string
  fallbackRpcUrls?: string[]
  explorerUrl: string
  subgraphUrl: string
  etherscanApiUrl?: string
  multicall?: string
}

export interface Chains {
  [key: string]: Partial<Chain>
}

export const metadata: any = {
  networks: chainsMetadata,
  tokens: tokensMetadata
}

const bondableChainsSet = new Set<string>([])
const config : any = {}
for (const network in chainNetworks) {
  const chains: Chains = {}

  for (const chain in (chainNetworks as any)[network]) {
    const chainConfig = (chainNetworks as any)[network][chain]
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

export { config }

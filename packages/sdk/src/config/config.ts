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
    chains[chain].subgraphUrl = chainConfig?.subgraphUrl
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
  const proxyEnabled = (coreConfig as any)[network].proxyEnabled
  const bridgeDeprecated = (coreConfig as any)[network].bridgeDeprecated

  config[network] = {
    addresses,
    chains,
    bonders,
    bonderFeeBps,
    destinationFeeGasPriceMultiplier,
    relayerFeeEnabled,
    relayerFeeWei,
    proxyEnabled,
    bridgeDeprecated
  }
}

export const bondableChains = Array.from(bondableChainsSet)
export const rateLimitMaxRetries = 3
export const rpcTimeoutSeconds = 60

export const etherscanApiKeys: Record<string, string> = {
  ethereum: process.env.ETHERSCAN_ETHEREUM_API_KEY ?? '',
  polygon: process.env.ETHERSCAN_POLYGON_API_KEY ?? '',
  optimism: process.env.ETHERSCAN_OPTIMISM_API_KEY ?? '',
  arbitrum: process.env.ETHERSCAN_ARBITRUM_API_KEY ?? '',
  gnosis: process.env.ETHERSCAN_GNOSIS_API_KEY ?? '',
  nova: process.env.ETHERSCAN_NOVA_API_KEY ?? '',
  base: process.env.ETHERSCAN_BASE_API_KEY ?? '',
  linea: process.env.ETHERSCAN_LINEA_API_KEY ?? ''
}

export const etherscanApiUrls: Record<string, string> = {
  ethereum: 'https://api.etherscan.io',
  polygon: 'https://api.polygonscan.com',
  optimism: 'https://api-optimistic.etherscan.io',
  arbitrum: 'https://api.arbiscan.io',
  gnosis: 'https://api.gnosisscan.io',
  nova: 'https://api-nova.arbiscan.io',
  base: 'https://api.basescan.org',
  linea: 'https://api.lineascan.build'
}

export { metadata, config }

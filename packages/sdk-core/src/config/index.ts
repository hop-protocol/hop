import { networks as chainNetworks } from '#networks/index.js'
import { chains as chainsMetadata, tokens as tokensMetadata } from '#metadata/index.js'

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

export const sdkMetadata: any = {
  networks: chainsMetadata,
  tokens: tokensMetadata
}

const bondableChainsSet = new Set<string>([])
const sdkConfig : any = {}
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
    sdkConfig[network] = { chains }
  }
}

export { sdkConfig }
export const bondableChains = Array.from(bondableChainsSet)
export const rateLimitMaxRetries = 3
export const rpcTimeoutSeconds = 60

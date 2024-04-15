import { config as goerli } from './goerli.js'
import { config as mainnet } from './mainnet.js'
import { config as sepolia } from './sepolia.js'

const config = { goerli, sepolia, mainnet }

export { goerli, sepolia, mainnet, config }
export {
  ChainSlug,
  AssetSymbol,
  FinalityState,
  Bps,
  Fees,
  RelayerFeeWei,
  RelayerFeeEnabled,
  BridgeDeprecated,
  TotalStake,
  DefaultSendGasLimit,
  Config
} from './types.js'

// ---

import { addresses as chainAddresses } from '#addresses/index.js'
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
  }

  const addresses = (chainAddresses as any)[network].bridges
  const bonders = (chainAddresses as any)[network].bonders
  const bonderFeeBps = (config as any)[network].bonderFeeBps
  const destinationFeeGasPriceMultiplier = (config as any)[network].destinationFeeGasPriceMultiplier
  const relayerFeeEnabled = (config as any)[network].relayerFeeEnabled
  const relayerFeeWei = (config as any)[network].relayerFeeWei
  const bridgeDeprecated = (config as any)[network].bridgeDeprecated
  const defaultSendGasLimit = (config as any)[network].defaultSendGasLimit

  sdkConfig[network] = {
    addresses,
    chains,
    bonders,
    bonderFeeBps,
    destinationFeeGasPriceMultiplier,
    relayerFeeEnabled,
    relayerFeeWei,
    bridgeDeprecated,
    defaultSendGasLimit
  }
}

export const bondableChains = Array.from(bondableChainsSet)
export const rateLimitMaxRetries = 3
export const rpcTimeoutSeconds = 60

export { sdkConfig }

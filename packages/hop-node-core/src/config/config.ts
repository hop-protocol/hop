import os from 'node:os'
import { execSync } from 'node:child_process'
import {
  OneHourMs
} from '#constants/index.js'
import {
  ChainSlug,
  NetworkSlug,
} from '@hop-protocol/sdk'
import type { CoreEnvironment } from './environment.js'

let coreEnvironment: CoreEnvironment



// // Other
// export const gitRev = process.env.GIT_REV ?? execSync('git rev-parse --short HEAD').toString().trim()
// export const envNetwork = process.env.NETWORK ?? Network.Mainnet
// export const rateLimitMaxRetries = normalizeEnvVarNumber(process.env.RATE_LIMIT_MAX_RETRIES) ?? 5
// export const rpcTimeoutSeconds = normalizeEnvVarNumber(process.env.RPC_TIMEOUT_SECONDS) ?? 90
// export const CoingeckoApiKey = process.env.COINGECKO_API_KEY ?? ''
// export const hostname = process.env.HOSTNAME ?? os.hostname()
// export const appTld = process.env.APP_TLD ?? 'hop.exchange'

// // Gasboost
// export const setLatestNonceOnStart = process.env.SET_LATEST_NONCE_ON_START
// export const gasPriceMultiplier = normalizeEnvVarNumber(process.env.GAS_PRICE_MULTIPLIER)
// export const initialTxGasPriceMultiplier = normalizeEnvVarNumber(process.env.INITIAL_TX_GAS_PRICE_MULTIPLIER)
// export const priorityFeePerGasCap = normalizeEnvVarNumber(process.env.PRIORITY_FEE_PER_GAS_CAP)
// export const maxGasPriceGwei = normalizeEnvVarNumber(process.env.MAX_GAS_PRICE_GWEI)
// export const timeTilBoostMs = normalizeEnvVarNumber(process.env.TIME_TIL_BOOST_MS)
// // This value must be longer than the longest chain's finality
// export const TxRetryDelayMs = process.env.TX_RETRY_DELAY_MS ? Number(process.env.TX_RETRY_DELAY_MS) : OneHourMs
// export const maxPriorityFeeConfidenceLevel = normalizeEnvVarNumber(process.env.MAX_PRIORITY_FEE_CONFIDENCE_LEVEL) ?? 95
// export const blocknativeApiKey = process.env.BLOCKNATIVE_API_KEY ?? ''

// // AWS
// export const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID ?? 'abc'
// export const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY ?? '123'
// export const awsRegion = process.env.AWS_REGION ?? 'us-east-1'

// export const etherscanApiKeys: Record<string, string> = {
//   [Chain.Ethereum]: process.env.ETHERSCAN_API_KEY ?? '',
//   [Chain.Polygon]: process.env.POLYGONSCAN_API_KEY ?? '',
//   [Chain.Optimism]: process.env.OPTIMISM_API_KEY ?? '',
//   [Chain.Arbitrum]: process.env.ARBITRUM_API_KEY ?? '',
//   [Chain.Gnosis]: process.env.XDAI_API_KEY ?? '',
//   [Chain.Nova]: process.env.NOVA_API_KEY ?? '',
//   [Chain.Base]: process.env.BASE_API_KEY ?? '',
//   [Chain.Linea]: process.env.LINEA_API_KEY ?? '',
//   [Chain.PolygonZk]: process.env.POLYGONZK_API_KEY ?? ''
// }
export const etherscanApiUrls: Record<string, string> = {
  [ChainSlug.Ethereum]: 'https://api.etherscan.io',
  [ChainSlug.Polygon]: 'https://api.polygonscan.com',
  [ChainSlug.Optimism]: 'https://api-optimistic.etherscan.io',
  [ChainSlug.Arbitrum]: 'https://api.arbiscan.io',
  [ChainSlug.Gnosis]: 'https://api.gnosisscan.io',
  [ChainSlug.Nova]: 'https://api-nova.arbiscan.io',
  [ChainSlug.Base]: 'https://api.basescan.org',
  [ChainSlug.Linea]: 'https://api.lineascan.build',
  [ChainSlug.PolygonZk]: 'https://api-zkevm.polygonscan.com'
}

export type Tokens = Record<string, boolean>

export type SignerType = 'keystore' | 'kms' | 'lambda'

export type SignerConfig = {
  type: SignerType
  keyId?: string
  awsRegion?: string
  lambdaFunctionName?: string
}

export type BlocklistConfig = {
  path: string
  addresses: Record<string, boolean>
}

/**
 * Setters
 */


// Setters

export const setCoreEnvironment = (config: CoreEnvironment): void => {
  coreEnvironment = config
}
// TODO: I think this should go in env
// TODO: I don't think the core should care about env
export const setCoreBonderPrivateKey = (privateKey: string) => {
  config.bonderPrivateKey = privateKey
}

export const setCoreNetworkRpcUrl = (network: string, rpcUrl: string) => {
  (config.networks as any)[network].rpcUrl = rpcUrl
}

export const setCoreNetworkRedundantRpcUrls = (network: string, redundantRpcUrls: string[]) => {
  (config.networks as any)[network].redundantRpcUrls = redundantRpcUrls
}

export const setCoreNetworkMaxGasPrice = (network: string, maxGasPrice: number) => {
  (config.networks as any)[network].maxGasPrice = maxGasPrice
}

/**
 * Getters
 */

const getCoreNetworksConfig = (): any => {
  let networks: any = {}
  let metadata: any = {}

//   for (const network in coreNetworks) {
//     const config = getCoreNetworkConfig(network as NetworkSlug)
//     networks = { ...networks, ...config.networks }
//     metadata = { ...metadata, ...config.metadata }
//   }
//   return { networks, metadata }
// }

// export const getCoreNetworkConfig = (network: NetworkSlug): any => {
//   const coreNetwork = coreNetworks[network as NetworkSlug]
//   const networks: any = {}

//   for (const chain in coreNetwork) {
//     const chainObj = coreNetwork[chain as ChainSlug]
//     if (!networks[chain]) {
//       networks[chain] = {}
//     }
//     networks[chain].name = chainObj?.name
//     networks[chain].chainId = chainObj?.chainId
//     networks[chain].rpcUrl = chainObj?.publicRpcUrl
//   }

//   // Convert USDC to USDC.e
//   const metadata = coreMetadata[network as NetworkSlug]
//   if (metadata?.tokens?.USDC && metadata.tokens?.['USDC.e']) {
//     metadata.tokens.USDC = metadata.tokens?.['USDC.e']
//     metadata.tokens.USDC.symbol = 'USDC'
//     delete (metadata.tokens as any)?.['USDC.e']
//   }
  return { networks, metadata }
}

export type CoreConfig = {
  tokens: Tokens
  bonderPrivateKey: string
  signerConfig: SignerConfig
  blocklist: BlocklistConfig
  emergencyDryMode: boolean
  isMainnet: boolean
  network: string
  networks: any // TODO
  metadata: any // TODO
}

// export const gitRev = () => 
// TODO: THIS IS NOT CORRECT
const getEnvironment = (envVar: any): any => {
  return {
    // Other
    gitRev: envVar.gitRev,
    envNetwork: envVar.envNetwork,
    rateLimitMaxRetries: envVar.rateLimitMaxRetries,
    rpcTimeoutSeconds: envVar.rpcTimeoutSeconds,
    CoingeckoApiKey: envVar.CoingeckoApiKey,
    hostname: envVar.hostname,
    appTld: envVar.appTld,

    // Gasboost
    setLatestNonceOnStart: envVar.setLatestNonceOnStart,
    gasPriceMultiplier: envVar.gasPriceMultiplier,
    initialTxGasPriceMultiplier: envVar.initialTxGasPriceMultiplier,
    priorityFeePerGasCap: envVar.priorityFeePerGasCap,
    maxGasPriceGwei: envVar.maxGasPriceGwei,
    timeTilBoostMs: envVar.timeTilBoostMs,
    TxRetryDelayMs: envVar.TxRetryDelayMs,
    maxPriorityFeeConfidenceLevel: envVar.maxPriorityFeeConfidenceLevel,
    blocknativeApiKey: envVar.blocknativeApiKey,

    // AWS
    awsAccessKeyId: envVar.awsAccessKeyId,
    awsSecretAccessKey: envVar.awsSecretAccessKey,
    awsRegion: envVar.awsRegion,

    etherscanApiKeys: envVar.etherscanApiKeys,
  }
}

export const {
  // Other
  gitRev,
  envNetwork,
  rateLimitMaxRetries,
  rpcTimeoutSeconds,
  CoingeckoApiKey,
  hostname,
  appTld,

  // Gasboost
  setLatestNonceOnStart,
  gasPriceMultiplier,
  initialTxGasPriceMultiplier,
  priorityFeePerGasCap,
  maxGasPriceGwei,
  timeTilBoostMs,
  // This value must be longer than the longest chain's finality
  TxRetryDelayMs,
  maxPriorityFeeConfidenceLevel,
  blocknativeApiKey,

  // AWS
  awsAccessKeyId,
  awsSecretAccessKey,
  awsRegion,
  etherscanApiKeys
} = getEnvironment('')


export const config: CoreConfig = {
  tokens: {},
  bonderPrivateKey: '',
  signerConfig: {
    type: 'keystore'
  },
  blocklist: {
    path: '',
    addresses: {}
  },
  emergencyDryMode: false,
  network: envNetwork,
  isMainnet: envNetwork === NetworkSlug.Mainnet,
  ...getCoreNetworksConfig()
}

export const getCoreConfig = (): CoreConfig => {
  return config
}

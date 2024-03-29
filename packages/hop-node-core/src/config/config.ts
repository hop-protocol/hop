import os from 'node:os'
import {
  Chain,
  Network,
  OneHourMs
} from '#constants/index.js'
import { metadata as coreMetadata } from '@hop-protocol/core/metadata'
import { networks as coreNetworks } from '@hop-protocol/core/networks'
import { execSync } from 'node:child_process'
import { loadEnv } from './loadEnvFile.js'
import { normalizeEnvVarNumber } from './utils/normalizeEnvVarNumber.js'

loadEnv()

const bonderPrivateKey = process.env.BONDER_PRIVATE_KEY
export const setLatestNonceOnStart = process.env.SET_LATEST_NONCE_ON_START
export const hostname = process.env.HOSTNAME ?? os.hostname()
export const slackChannel = process.env.SLACK_CHANNEL
export const slackWarnChannel = process.env.SLACK_WARN_CHANNEL // optional
export const slackErrorChannel = process.env.SLACK_ERROR_CHANNEL // optional
export const slackInfoChannel = process.env.SLACK_INFO_CHANNEL // optional
export const slackLogChannel = process.env.SLACK_LOG_CHANNEL // optional
export const slackSuccessChannel = process.env.SLACK_SUCCESS_CHANNEL // optional
export const slackAuthToken = process.env.SLACK_AUTH_TOKEN
export const slackUsername = process.env.SLACK_USERNAME ?? 'Hop Node'
export const gasBoostWarnSlackChannel = process.env.GAS_BOOST_WARN_SLACK_CHANNEL // optional
export const gasBoostErrorSlackChannel = process.env.GAS_BOOST_ERROR_SLACK_CHANNEL // optional
export const gasPriceMultiplier = normalizeEnvVarNumber(process.env.GAS_PRICE_MULTIPLIER)
export const initialTxGasPriceMultiplier = normalizeEnvVarNumber(process.env.INITIAL_TX_GAS_PRICE_MULTIPLIER)
export const priorityFeePerGasCap = normalizeEnvVarNumber(process.env.PRIORITY_FEE_PER_GAS_CAP)
export const maxGasPriceGwei = normalizeEnvVarNumber(process.env.MAX_GAS_PRICE_GWEI)
export const timeTilBoostMs = normalizeEnvVarNumber(process.env.TIME_TIL_BOOST_MS)
export const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID
export const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
export const awsRegion = process.env.AWS_REGION ?? 'us-east-1'
export const awsProfile = process.env.AWS_PROFILE
export const gitRev = process.env.GIT_REV ?? execSync('git rev-parse --short HEAD').toString().trim()
export const monitorProviderCalls = process.env.MONITOR_PROVIDER_CALLS

// This value must be longer than the longest chain's finality
export const TxRetryDelayMs = process.env.TX_RETRY_DELAY_MS ? Number(process.env.TX_RETRY_DELAY_MS) : OneHourMs
export const envNetwork = process.env.NETWORK ?? Network.Mainnet
export const isTestMode = !!process.env.TEST_MODE

export const rateLimitMaxRetries = normalizeEnvVarNumber(process.env.RATE_LIMIT_MAX_RETRIES) ?? 5
export const rpcTimeoutSeconds = 90
export const appTld = process.env.APP_TLD ?? 'hop.exchange'

export const maxPriorityFeeConfidenceLevel = normalizeEnvVarNumber(process.env.MAX_PRIORITY_FEE_CONFIDENCE_LEVEL) ?? 95
export const blocknativeApiKey = process.env.BLOCKNATIVE_API_KEY ?? ''
export const CoingeckoApiKey = process.env.COINGECKO_API_KEY ?? ''

export const etherscanApiKeys: Record<string, string> = {
  [Chain.Ethereum]: process.env.ETHERSCAN_API_KEY ?? '',
  [Chain.Polygon]: process.env.POLYGONSCAN_API_KEY ?? '',
  [Chain.Optimism]: process.env.OPTIMISM_API_KEY ?? '',
  [Chain.Arbitrum]: process.env.ARBITRUM_API_KEY ?? '',
  [Chain.Gnosis]: process.env.XDAI_API_KEY ?? '',
  [Chain.Nova]: process.env.NOVA_API_KEY ?? '',
  [Chain.Base]: process.env.BASE_API_KEY ?? '',
  [Chain.Linea]: process.env.LINEA_API_KEY ?? '',
  [Chain.PolygonZk]: process.env.POLYGONZK_API_KEY ?? ''
}
export const etherscanApiUrls: Record<string, string> = {
  [Chain.Ethereum]: 'https://api.etherscan.io',
  [Chain.Polygon]: 'https://api.polygonscan.com',
  [Chain.Optimism]: 'https://api-optimistic.etherscan.io',
  [Chain.Arbitrum]: 'https://api.arbiscan.io',
  [Chain.Gnosis]: 'https://api.gnosisscan.io',
  [Chain.Nova]: 'https://api-nova.arbiscan.io',
  [Chain.Base]: 'https://api.basescan.org',
  [Chain.Linea]: 'https://api.lineascan.build',
  [Chain.PolygonZk]: 'https://api-zkevm.polygonscan.com'
}

export type MetricsConfig = {
  enabled: boolean
  port?: number
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

const getCoreNetworksConfig = (): any => {
  let networks: any = {}
  let metadata: any = {}

  for (const network in coreNetworks) {
    const config = getCoreNetworkConfig(network as Network)
    networks = { ...networks, ...config.networks }
    metadata = { ...metadata, ...config.metadata }
  }
  return { networks, metadata }
}

export const getCoreNetworkConfig = (network: Network): any => {
  const coreNetwork = coreNetworks[network as Network]
  const networks: any = {}

  for (const chain in coreNetwork) {
    const chainObj = coreNetwork[chain as Chain]
    if (!networks[chain]) {
      networks[chain] = {}
    }
    networks[chain].name = chainObj?.name
    networks[chain].chainId = chainObj?.networkId
    networks[chain].rpcUrl = chainObj?.publicRpcUrl
  }

  const metadata = coreMetadata[network as Network]
  return { networks, metadata }
}

export type CoreConfig = {
  tokens: Tokens
  bonderPrivateKey: string
  metrics: MetricsConfig
  signerConfig: SignerConfig
  blocklist: BlocklistConfig
  emergencyDryMode: boolean
  isMainnet: boolean
  network: string
  networks: Networks
  metadata: Metadata
}

export const config: CoreConfig = {
  tokens: {},
  bonderPrivateKey: bonderPrivateKey ?? '',
  metrics: {
    enabled: false
  },
  signerConfig: {
    type: 'keystore'
  },
  blocklist: {
    path: '',
    addresses: {}
  },
  emergencyDryMode: false,
  network: envNetwork,
  isMainnet: envNetwork === Network.Mainnet,
  ...getCoreNetworksConfig()
}

export const getCoreConfig = (): CoreConfig => {
  return config
}

// Setters

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

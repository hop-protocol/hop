import buildInfo from 'src/.build-info.json'
import normalizeEnvVarNumber from './utils/normalizeEnvVarNumber'
import os from 'os'
import path from 'path'
import { Addresses, Bonders, Bridges } from '@hop-protocol/core/addresses'
import { Chain, DefaultBatchBlocks, Network, OneHourMs, TotalBlocks } from 'src/constants'
import { Tokens as Metadata } from '@hop-protocol/core/metadata'
import { Networks } from '@hop-protocol/core/networks'
import * as goerliConfig from './goerli'
import * as kovanConfig from './kovan'
import * as mainnetConfig from './mainnet'
import * as stagingConfig from './staging'
import * as testConfig from './test'
require('./loadEnvFile')
const defaultDbPath = path.resolve(__dirname, '../../../db_data')

export const ipfsHost = process.env.IPFS_HOST ?? 'http://127.0.0.1:5001'
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
export const healthCheckerWarnSlackChannel = process.env.HEALTH_CHECKER_WARN_SLACK_CHANNEL // optional
export const gasPriceMultiplier = normalizeEnvVarNumber(process.env.GAS_PRICE_MULTIPLIER)
export const minPriorityFeePerGas = normalizeEnvVarNumber(process.env.MIN_PRIORITY_FEE_PER_GAS)
export const priorityFeePerGasCap = normalizeEnvVarNumber(process.env.PRIORITY_FEE_PER_GAS_CAP)
export const maxGasPriceGwei = normalizeEnvVarNumber(process.env.MAX_GAS_PRICE_GWEI)
export const timeTilBoostMs = normalizeEnvVarNumber(process.env.TIME_TIL_BOOST_MS)
export const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID
export const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
export const awsRegion = process.env.AWS_REGION ?? 'us-east-1'
export const awsProfile = process.env.AWS_PROFILE
export const gitRev = buildInfo.rev
export const monitorProviderCalls = process.env.MONITOR_PROVIDER_CALLS
export const setLatestNonceOnStart = process.env.SET_LATEST_NONCE_ON_START
export const TxRetryDelayMs = process.env.TX_RETRY_DELAY_MS ? Number(process.env.TX_RETRY_DELAY_MS) : OneHourMs
const envNetwork = process.env.NETWORK ?? Network.Kovan
const isTestMode = !!process.env.TEST_MODE
const bonderPrivateKey = process.env.BONDER_PRIVATE_KEY

export const oruChains: Set<string> = new Set([Chain.Optimism, Chain.Arbitrum])
export const rateLimitMaxRetries = 5
export const rpcTimeoutSeconds = 90
export const defaultConfigDir = `${os.homedir()}/.hop-node`
export const defaultConfigFilePath = `${defaultConfigDir}/config.json`
export const defaultKeystoreFilePath = `${defaultConfigDir}/keystore.json`

type SyncConfig = {
  totalBlocks?: number
  batchBlocks?: number
}
type SyncConfigs = { [key: string]: SyncConfig }
type DbConfig = {
  path: string
}
type MetricsConfig = {
  enabled: boolean
  port?: number
}

type Bps = {
  ethereum: number
  polygon: number
  gnosis: number
  optimism: number
  arbitrum: number
}

export type Fees = Record<string, Bps>
export type Routes = Record<string, Record<string, boolean>>
export type CommitTransfersConfig = {
  minThresholdAmount: Record<string, Record<string, Record<string, any>>>
}
type Tokens = Record<string, boolean>

export type Config = {
  isMainnet: boolean
  tokens: Tokens
  addresses: Bridges & {[network: string]: any}
  network: string
  networks: Networks & {[network: string]: any}
  bonderPrivateKey: string
  metadata: Metadata & {[network: string]: any}
  bonders: Bonders
  db: DbConfig
  sync: SyncConfigs
  metrics: MetricsConfig
  commitTransfers: CommitTransfersConfig
  fees: Fees
  routes: Routes
}

const networkConfigs: {[key: string]: any} = {
  test: testConfig,
  kovan: kovanConfig,
  goerli: goerliConfig,
  mainnet: mainnetConfig,
  staging: stagingConfig
}

const normalizeNetwork = (network: string) => {
  if (network === Network.Staging) {
    return Network.Mainnet
  }
  return network
}

const getConfigByNetwork = (network: string): Pick<Config, 'network' | 'addresses' | 'networks' | 'metadata' | 'isMainnet'> => {
  const { addresses, networks, metadata } = isTestMode ? networkConfigs.test : (networkConfigs as any)?.[network]
  network = normalizeNetwork(network)
  const isMainnet = network === Network.Mainnet

  return {
    network,
    addresses,
    networks,
    metadata,
    isMainnet
  }
}

// get default config
const { addresses, network, networks, metadata, isMainnet } = getConfigByNetwork(envNetwork)

// defaults
export const config: Config = {
  isMainnet,
  addresses,
  network,
  networks,
  tokens: {},
  bonderPrivateKey: bonderPrivateKey ?? '',
  metadata,
  bonders: {},
  fees: {},
  routes: {},
  db: {
    path: defaultDbPath
  },
  sync: {
    [Chain.Ethereum]: {
      totalBlocks: TotalBlocks.Ethereum,
      batchBlocks: DefaultBatchBlocks
    },
    [Chain.Arbitrum]: {
      totalBlocks: 100_000,
      batchBlocks: DefaultBatchBlocks
    },
    [Chain.Optimism]: {
      totalBlocks: 100_000,
      batchBlocks: DefaultBatchBlocks
    },
    [Chain.Polygon]: {
      totalBlocks: TotalBlocks.Polygon,
      batchBlocks: DefaultBatchBlocks
    },
    [Chain.Gnosis]: {
      totalBlocks: TotalBlocks.Gnosis,
      batchBlocks: DefaultBatchBlocks
    }
  },
  metrics: {
    enabled: false
  },
  commitTransfers: {
    minThresholdAmount: {}
  }
}

export const setConfigByNetwork = (network: string) => {
  const { addresses, networks, metadata, isMainnet } = getConfigByNetwork(network)
  config.isMainnet = isMainnet
  config.addresses = addresses
  config.network = normalizeNetwork(network)
  config.networks = networks
  config.metadata = metadata
}

export const setConfigAddresses = (addresses: Addresses) => {
  const { bridges } = addresses
  config.addresses = bridges
}

export const setConfigBonders = (bonders: Bonders) => {
  config.bonders = bonders
}

export const getConfigBondersForToken = (token: string) => {
  return (config.bonders as any)?.[token]
}

export const getConfigBonderForRoute = (token: string, sourceChain: string, destinationChain: string) => {
  const bonders = getConfigBondersForToken(token)
  const bonder = bonders?.[sourceChain]?.[destinationChain]
  return bonder
}

export const setBonderPrivateKey = (privateKey: string) => {
  config.bonderPrivateKey = privateKey
}

export const setNetworkRpcUrl = (network: string, rpcUrl: string) => {
  network = normalizeNetwork(network)
  if (config.networks[network]) {
    config.networks[network].rpcUrl = rpcUrl
  }
}

export const setNetworkMaxGasPrice = (network: string, maxGasPrice: number) => {
  network = normalizeNetwork(network)
  if (config.networks[network]) {
    config.networks[network].maxGasPrice = maxGasPrice
  }
}

export const getNetworkMaxGasPrice = (network: string) => {
  return config.networks[network].maxGasPrice
}

export const setSyncConfig = (syncConfigs: SyncConfigs = {}) => {
  const networks = Object.keys(config.networks)
  for (const network of networks) {
    if (!config.sync[network]) {
      config.sync = config.sync ?? {}
      config.sync[network] = {}
    }
    if (syncConfigs[network].totalBlocks) {
      config.sync[network].totalBlocks = syncConfigs[network].totalBlocks
    }
    if (syncConfigs[network].batchBlocks) {
      config.sync[network].batchBlocks = syncConfigs[network].batchBlocks
    }
  }
}

export const setDbPath = (dbPath: string) => {
  config.db.path = dbPath
}

export const getEnabledTokens = (): string[] => {
  return Object.keys(config.tokens).filter(token => config.tokens[token])
}

export const getEnabledNetworks = (): string[] => {
  const networks: {[network: string]: boolean} = {}
  for (const token in config.addresses) {
    for (const network in config.addresses[token]) {
      networks[network] = true
    }
  }
  return Object.keys(networks)
}

export function getAllChains () {
  return Object.keys(config.networks)
}

export function getAllTokens () {
  return Object.keys(config.addresses)
}

export const setMetricsConfig = (metricsConfig: MetricsConfig) => {
  config.metrics = { ...config.metrics, ...metricsConfig }
}

export const setFeesConfig = (fees: Fees) => {
  config.fees = { ...config.fees, ...fees }
}

export const setRoutesConfig = (routes: Routes) => {
  config.routes = { ...config.routes, ...routes }
}

export const setCommitTransfersConfig = (commitTransfers: CommitTransfersConfig) => {
  config.commitTransfers = { ...config.commitTransfers, ...commitTransfers }
}

export const setConfigTokens = (tokens: Tokens) => {
  config.tokens = { ...config.tokens, ...tokens }
}

export const getBonderConfig = (tokens: Tokens) => {
  config.tokens = { ...config.tokens, ...tokens }
}

export const chainNativeTokens = ['ETH', 'MATIC', 'DAI']

export enum Watchers {
  BondTransferRoot = 'bondTransferRoot',
  BondWithdrawal = 'bondWithdrawal',
  Challenge = 'challenge',
  CommitTransfers = 'commitTransfers',
  SettleBondedWithdrawals = 'settleBondedWithdrawals',
  xDomainMessageRelay = 'xDomainMessageRelay',
}

export { Bonders }
export * from './validation'
export * from './fileOps'

import { execSync } from 'node:child_process'
import os from 'node:os'
import path from 'node:path'
import url from 'node:url'
import { type Addresses, type Bonders, type Bridges, addresses as coreAddresses } from '@hop-protocol/sdk/addresses'
import {
  TimeIntervals,
  AVG_BLOCK_TIME_SECONDS,
} from '#constants/index.js'
import { CoreEnvironment } from './coreConfig.js'
import { DefaultBondThreshold } from '#constants/index.js'
import { utils } from 'ethers'
import type { Bps } from '@hop-protocol/sdk'
import type {
  SignerConfig,
  Tokens
} from './coreConfig.js'
import {
  normalizeEnvVarArray,
  normalizeEnvVarNumber,
} from './types.js'
import type { BonderConfig } from './types.js'
import type { SyncType } from '#constants/index.js'
import { loadEnvFile } from 'node:process'
import { getEnvFilePath } from '#utils/getEnvFilePath.js'
import {
  ChainSlug,
  NetworkSlug,
  TokenSymbol,
  getNetworks,
  sdkConfig as coreConfig
} from '@hop-protocol/sdk'

const envFilePath = getEnvFilePath()
if (envFilePath) {
  loadEnvFile(envFilePath)
}

export type BlocklistConfig = {
  path: string
  addresses: Record<string, boolean>
}
const bonderPrivateKey = process.env.BONDER_PRIVATE_KEY

// TODO: Normalize bool. This will be true if CCTP_ENABLED is set to anything
export const CCTPEnabled = !!process.env.CCTP_ENABLED ?? false
const dirname = url.fileURLToPath(new URL('.', import.meta.url))
const defaultDbPath = path.resolve(dirname, '../../db_data')
// const defaultDbPath = path.resolve(__dirname, '../../db_data')
export const ipfsHost = process.env.IPFS_HOST ?? 'http://127.0.0.1:5001'
export const healthCheckerWarnSlackChannel = process.env.HEALTH_CHECKER_WARN_SLACK_CHANNEL

// This value must be longer than the longest chain's finality
export const TxRetryDelayMs = process.env.TX_RETRY_DELAY_MS ? Number(process.env.TX_RETRY_DELAY_MS) : TimeIntervals.ONE_HOUR_MS
export const BondWithdrawalBatchSize = normalizeEnvVarNumber(process.env.BOND_WITHDRAWAL_BATCH_SIZE) ?? 25
export const RelayTransactionBatchSize = BondWithdrawalBatchSize

export const defaultConfigDir = `${os.homedir()}/.hop`
export const defaultConfigFilePath = `${defaultConfigDir}/config.json`
export const defaultKeystoreFilePath = `${defaultConfigDir}/keystore.json`
export const minEthBonderFeeBn = utils.parseEther('0.00001')
export const pendingCountCommitThreshold = normalizeEnvVarNumber(process.env.PENDING_COUNT_COMMIT_THRESHOLD) ?? 921 // 90% of 1024
export const expectedNameservers = normalizeEnvVarArray(process.env.EXPECTED_APP_NAMESERVERS)
export const modifiedLiquidityRoutes = process.env.MODIFIED_LIQUIDITY_ROUTES?.split(',') ?? []
export const wsEnabledChains = process.env.WS_ENABLED_CHAINS?.split(',') ?? []
export const BondThreshold = normalizeEnvVarNumber(process.env.BOND_THRESHOLD) ?? DefaultBondThreshold
// TODO: Normalize bool. This will be true if ENFORCE_RELAYER_FEE is set to anything
export const EnforceRelayerFee = !!process.env.ENFORCE_RELAYER_FEE ?? false
export const isTestMode = !!process.env.TEST_MODE

// Decreasing SyncCyclesPerFullSync will result in more full syncs (root data) more often. This is useful for the
// available liquidity watcher to have up-to-date info
export const SyncIntervalSec = process.env.SYNC_INTERVAL_SEC ? Number(process.env.SYNC_INTERVAL_SEC) : 30
export const SyncIntervalMultiplier = process.env.SYNC_INTERVAL_MULTIPLIER ? Number(process.env.SYNC_INTERVAL_MULTIPLIER) : 1
export const SyncCyclesPerFullSync = process.env.SYNC_CYCLES_PER_FULL_SYNC ? Number(process.env.SYNC_CYCLES_PER_FULL_SYNC) : 60

// Slack
export const slackChannel = process.env.SLACK_CHANNEL
export const slackWarnChannel = process.env.SLACK_WARN_CHANNEL // optional
export const slackErrorChannel = process.env.SLACK_ERROR_CHANNEL // optional
export const slackInfoChannel = process.env.SLACK_INFO_CHANNEL // optional
export const slackLogChannel = process.env.SLACK_LOG_CHANNEL // optional
export const slackSuccessChannel = process.env.SLACK_SUCCESS_CHANNEL // optional
export const slackAuthToken = process.env.SLACK_AUTH_TOKEN
export const slackUsername = process.env.SLACK_USERNAME ?? 'Hop Node'

// Other
export const LogLevel = process.env.LOG_LEVEL ?? 'debug'

export const etherscanApiKeys: Record<string, string> = {
  [ChainSlug.Ethereum]: process.env.ETHERSCAN_API_KEY ?? '',
  [ChainSlug.Polygon]: process.env.POLYGONSCAN_API_KEY ?? '',
  [ChainSlug.Optimism]: process.env.OPTIMISM_API_KEY ?? '',
  [ChainSlug.Arbitrum]: process.env.ARBITRUM_API_KEY ?? '',
  [ChainSlug.Gnosis]: process.env.XDAI_API_KEY ?? '',
  [ChainSlug.Nova]: process.env.NOVA_API_KEY ?? '',
  [ChainSlug.Base]: process.env.BASE_API_KEY ?? '',
  [ChainSlug.Linea]: process.env.LINEA_API_KEY ?? '',
  [ChainSlug.PolygonZk]: process.env.POLYGONZK_API_KEY ?? ''
}

/**
 * Core Config
 */

// Other
export const gitRev = process.env.GIT_REV ?? execSync('git rev-parse --short HEAD').toString().trim()
export const envNetwork = process.env.NETWORK as NetworkSlug ?? NetworkSlug.Mainnet
export const rateLimitMaxRetries = normalizeEnvVarNumber(process.env.RATE_LIMIT_MAX_RETRIES) ?? 5
export const rpcTimeoutSeconds = normalizeEnvVarNumber(process.env.RPC_TIMEOUT_SECONDS) ?? 90
export const CoingeckoApiKey = process.env.COINGECKO_API_KEY ?? ''
export const hostname = process.env.HOSTNAME ?? os.hostname()
export const appTld = process.env.APP_TLD ?? 'hop.exchange'

// Gasboost
export const setLatestNonceOnStart = !!process.env.SET_LATEST_NONCE_ON_START ?? false
export const gasPriceMultiplier = normalizeEnvVarNumber(process.env.GAS_PRICE_MULTIPLIER)
export const initialTxGasPriceMultiplier = normalizeEnvVarNumber(process.env.INITIAL_TX_GAS_PRICE_MULTIPLIER)
export const priorityFeePerGasCap = normalizeEnvVarNumber(process.env.PRIORITY_FEE_PER_GAS_CAP)
export const maxGasPriceGwei = normalizeEnvVarNumber(process.env.MAX_GAS_PRICE_GWEI)
export const timeTilBoostMs = normalizeEnvVarNumber(process.env.TIME_TIL_BOOST_MS)
// This value must be longer than the longest chain's finality
export const maxPriorityFeeConfidenceLevel = normalizeEnvVarNumber(process.env.MAX_PRIORITY_FEE_CONFIDENCE_LEVEL) ?? 95
export const blocknativeApiKey = process.env.BLOCKNATIVE_API_KEY ?? ''

// AWS
export const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID ?? ''
export const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY ?? ''
export const awsRegion = process.env.AWS_REGION ?? 'us-east-1'

export const emergencyDryMode = false

CoreEnvironment.getInstance().setEnvironment({
  // Gasboost
  setLatestNonceOnStart,
  gasPriceMultiplier,
  initialTxGasPriceMultiplier,
  priorityFeePerGasCap,
  maxGasPriceGwei,
  timeTilBoostMs,
  maxPriorityFeeConfidenceLevel,
  blocknativeApiKey,

  // AWS
  awsAccessKeyId,
  awsSecretAccessKey,
  awsRegion,

  // Other
  gitRev,
  envNetwork,
  rateLimitMaxRetries,
  rpcTimeoutSeconds,
  CoingeckoApiKey,
  hostname,
  appTld,
})

if (bonderPrivateKey) {
  const coreEnvironment = CoreEnvironment.getInstance()
  coreEnvironment.setBonderPrivateKey(bonderPrivateKey)
}

type SyncConfig = {
  totalBlocks?: number
  batchBlocks?: number
}
type SyncConfigs = { [key: string]: SyncConfig }
type DbConfig = {
  path: string
}

export type Fees = Record<string, Bps>
export type Routes = Record<string, Record<string, boolean>>
export type CommitTransfersConfig = {
  minThresholdAmount: Record<string, Record<string, Record<string, any>>>
}

export type MetricsConfig = {
  enabled: boolean
  port?: number
}

export type Config = {
  tokens: Tokens
  bonderPrivateKey: string
  signerConfig: SignerConfig
  blocklist: BlocklistConfig
  emergencyDryMode: boolean
  isMainnet: boolean
  network: string
  networks: any & {[network: string]: any}
  addresses: Partial<Bridges> & {[network: string]: any}
  bonders: Bonders
  bonderConfig: BonderConfig
  db: DbConfig
  sync: SyncConfigs
  commitTransfers: CommitTransfersConfig
  fees: Fees
  routes: Routes
  metrics: MetricsConfig
}

const networkConfigs: {[key: string]: any} = {}

for (const network of getNetworks()) {
  if (network.slug !== envNetwork) continue
  const coreEnvironment = CoreEnvironment.getInstance()
  const { bridges: addresses, bonders } = coreAddresses[network.slug]
  const bonderConfig: BonderConfig = {}
  const networks: any = {}

  for (const chain of Object.values(network.chains)) {
    if (!networks[chain.slug]) {
      networks[chain.slug] = {}
    }
    networks[chain.slug].name = chain.name
    networks[chain.slug].chainId = Number(chain.chainId)
    networks[chain.slug].rpcUrl = chain.publicRpcUrl
    networks[chain.slug].subgraphUrl = chain.subgraphUrl
    coreEnvironment.setRpcUrl(chain.slug, chain.publicRpcUrl)
  }

  bonderConfig.totalStake = coreConfig[network.slug].bonderTotalStake

  // Convert USDC to USDC.e
  if (addresses.USDC && addresses['USDC.e']) {
    addresses.USDC = addresses['USDC.e']
    delete addresses['USDC.e']
  }

  // Convert USDC to USDC.e
  if (bonders.USDC && bonders['USDC.e']) {
    bonders.USDC = bonders['USDC.e']
    delete bonders['USDC.e']
  }

  const networkInfo = { addresses, bonders, bonderConfig, networks }
  networkConfigs[network.slug] = networkInfo
}

const getConfigByNetwork = (network: NetworkSlug | string): Pick<Config, 'network' | 'addresses' | 'bonders' | 'bonderConfig' | 'networks' | 'isMainnet'> => {
  const networkConfig = isTestMode ? networkConfigs.test : networkConfigs?.[network]
  if (!networkConfig) {
    throw new Error(`Network config not found for network: ${network}`)
  }

  const { addresses, bonders, bonderConfig, networks } = networkConfig
  const isMainnet = network === NetworkSlug.Mainnet

  // Temp handle USDC native vs bridge
  let modifiedAddresses = addresses
  for (const token in addresses) {
    if (token === 'USDC.e') {
      modifiedAddresses = {
        ...modifiedAddresses,
        'USDC': addresses?.['USDC.e']
      }
    }
  }

  return {
    network,
    addresses: modifiedAddresses,
    bonders,
    bonderConfig,
    networks,
    isMainnet
  }
}


const { network, networks, addresses, bonders, bonderConfig, isMainnet } = getConfigByNetwork(envNetwork)

const DefaultBatchBlocks = 10000
export const TotalBlocks = {
  Ethereum: Math.floor(TimeIntervals.ONE_WEEK_SECONDS / AVG_BLOCK_TIME_SECONDS[ChainSlug.Ethereum]!),
  Polygon: Math.floor(TimeIntervals.ONE_WEEK_SECONDS / AVG_BLOCK_TIME_SECONDS[ChainSlug.Polygon]!),
  Gnosis: Math.floor(TimeIntervals.ONE_WEEK_SECONDS / AVG_BLOCK_TIME_SECONDS[ChainSlug.Gnosis]!)
}

export const config: Config = {
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
  isMainnet,
  network,
  networks,
  addresses,
  bonders,
  bonderConfig,
  fees: {},
  routes: {},
  db: {
    path: defaultDbPath
  },
  sync: {
    [ChainSlug.Ethereum]: {
      totalBlocks: TotalBlocks.Ethereum,
      batchBlocks: 2000
    },
    [ChainSlug.Arbitrum]: {
      totalBlocks: 100_000,
      batchBlocks: DefaultBatchBlocks
    },
    [ChainSlug.Optimism]: {
      totalBlocks: 100_000,
      batchBlocks: 2000
    },
    [ChainSlug.Polygon]: {
      totalBlocks: TotalBlocks.Polygon,
      batchBlocks: 2000
    },
    [ChainSlug.Gnosis]: {
      totalBlocks: TotalBlocks.Gnosis,
      batchBlocks: DefaultBatchBlocks
    },
    [ChainSlug.Nova]: {
      totalBlocks: 100_000,
      batchBlocks: DefaultBatchBlocks
    },
    [ChainSlug.ZkSync]: {
      totalBlocks: 100_000,
      batchBlocks: DefaultBatchBlocks
    },
    [ChainSlug.Linea]: {
      totalBlocks: 100_000,
      batchBlocks: 2000
    },
    [ChainSlug.ScrollZk]: {
      totalBlocks: 100_000,
      batchBlocks: DefaultBatchBlocks
    },
    [ChainSlug.Base]: {
      totalBlocks: 100_000,
      batchBlocks: 2000
    },
    [ChainSlug.PolygonZk]: {
      totalBlocks: 100_000,
      batchBlocks: DefaultBatchBlocks
    }
  },
  commitTransfers: {
    minThresholdAmount: {}
  },
  metrics: {
    enabled: false
  },
}

export const setConfigByNetwork = (network: string) => {
  const { addresses, networks, isMainnet } = getConfigByNetwork(network)
  config.isMainnet = isMainnet
  config.addresses = addresses
  config.network = network
  config.networks = networks
}

export const setConfigAddresses = (addresses: Addresses) => {
  const { bridges } = addresses
  config.addresses = bridges
}

export const setConfigBonders = (bonders: Bonders) => {
  config.bonders = bonders
}

export const setNetworkCustomSyncType = (network: string, customSyncType: SyncType) => {
  if (config.networks[network]) {
    config.networks[network].customSyncType = customSyncType
  }
}

// Core Setters

export const setBonderPrivateKey = (privateKey: string) => {
  const coreEnvironment = CoreEnvironment.getInstance()
  config.bonderPrivateKey = privateKey
  coreEnvironment.setBonderPrivateKey(privateKey)
}

export const setNetworkRpcUrl = (network: string, rpcUrl: string) => {
  const coreEnvironment = CoreEnvironment.getInstance()
  if (config.networks[network]) {
    config.networks[network].rpcUrl = rpcUrl
    coreEnvironment.setRpcUrl(network as ChainSlug, rpcUrl)
  }
}

export const setNetworkRedundantRpcUrls = (network: string, redundantRpcUrls: string[]) => {
  if (config.networks[network]) {
    config.networks[network].redundantRpcUrls = redundantRpcUrls
  }
}

export const setNetworkMaxGasPrice = (network: string, maxGasPrice: number) => {
  if (config.networks[network]) {
    config.networks[network].maxGasPrice = maxGasPrice
  }
}

export const getNetworkCustomSyncType = (network: string): SyncType | undefined => {
  return config.networks[network]?.customSyncType
}

export const setSyncConfig = (syncConfigs: SyncConfigs = {}) => {
  const networks = Object.keys(config.networks)
  for (const network of networks) {
    if (!syncConfigs[network]) {
      continue
    }
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
  for (const token in config.tokens) {
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

export function getSourceChains (tokenSymbol: string, settlementChain?: string): string[] {
  const enabledChains = getAllChains()
  const sourceChains = new Set<string>([])
  for (const chain of enabledChains) {
    if (chain === ChainSlug.Ethereum || chain === settlementChain) {
      continue
    }
    if (!config.addresses[tokenSymbol][chain]) {
      continue
    }
    sourceChains.add(chain)
  }

  return Array.from(sourceChains)
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

export const setSignerConfig = (signerConfig: SignerConfig) => {
  const coreEnvironment = CoreEnvironment.getInstance()
  config.signerConfig = { ...config.signerConfig, ...signerConfig }
  coreEnvironment.setSignerConfig(signerConfig)
}

export const setBlocklistConfig = (blocklist: BlocklistConfig) => {
  config.blocklist = { ...config.blocklist, ...blocklist }
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
  ConfirmRoots = 'confirmRoots',
  L1ToL2Relay = 'L1ToL2Relay',
}

export function enableEmergencyMode () {
  config.emergencyDryMode = true
}

export const getBonderTotalStake = (token: string): number | undefined => {
  return config.bonderConfig?.totalStake?.[token as TokenSymbol]
}

const getConfigBondersForToken = (token: string) => {
  return config.bonders?.[token as TokenSymbol]
}

export const getConfigBonderForRoute = (token: string, sourceChain: string, destinationChain: string) => {
  const bonders = getConfigBondersForToken(token)
  const bonder = bonders?.[sourceChain as ChainSlug]?.[destinationChain as ChainSlug]
  return bonder
}


export { type Bonders }
export * from './validation.js'
export * from './fileOps.js'

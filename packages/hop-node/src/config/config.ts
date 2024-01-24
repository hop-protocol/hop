import normalizeEnvVarArray from './utils/normalizeEnvVarArray'
import normalizeEnvVarNumber from './utils/normalizeEnvVarNumber'
import os from 'os'
import path from 'path'
import { Addresses, Bonders, Bridges, addresses as coreAddresses } from '@hop-protocol/core/addresses'
import { AssetSymbol, Bps, config as coreConfig } from '@hop-protocol/core/config'
import { BonderConfig } from 'src/config/types'
import {
  Chain,
  DefaultBatchBlocks,
  DefaultBondThreshold,
  Network,
  OneHourMs,
  SyncType,
  TotalBlocks
} from 'src/constants'
import { Tokens as Metadata, metadata as coreMetadata } from '@hop-protocol/core/metadata'
import { Networks, networks as coreNetworks } from '@hop-protocol/core/networks'
import { execSync } from 'child_process';
import { parseEther } from 'ethers/lib/utils'

require('./loadEnvFile')
const defaultDbPath = path.resolve(__dirname, '../../db_data')

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
export const initialTxGasPriceMultiplier = normalizeEnvVarNumber(process.env.INITIAL_TX_GAS_PRICE_MULTIPLIER)
export const priorityFeePerGasCap = normalizeEnvVarNumber(process.env.PRIORITY_FEE_PER_GAS_CAP)
export const maxGasPriceGwei = normalizeEnvVarNumber(process.env.MAX_GAS_PRICE_GWEI)
export const timeTilBoostMs = normalizeEnvVarNumber(process.env.TIME_TIL_BOOST_MS)
export const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID
export const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
export const awsRegion = process.env.AWS_REGION ?? 'us-east-1'
export const awsProfile = process.env.AWS_PROFILE
export const gitRev = execSync('git rev-parse --short HEAD').toString().trim()
export const monitorProviderCalls = process.env.MONITOR_PROVIDER_CALLS
export const setLatestNonceOnStart = process.env.SET_LATEST_NONCE_ON_START

// This value must be longer than the longest chain's finality
export const TxRetryDelayMs = process.env.TX_RETRY_DELAY_MS ? Number(process.env.TX_RETRY_DELAY_MS) : OneHourMs
export const BondWithdrawalBatchSize = normalizeEnvVarNumber(process.env.BOND_WITHDRAWAL_BATCH_SIZE) ?? 25
export const RelayTransactionBatchSize = BondWithdrawalBatchSize
const envNetwork = process.env.NETWORK ?? Network.Mainnet
const isTestMode = !!process.env.TEST_MODE
const bonderPrivateKey = process.env.BONDER_PRIVATE_KEY

export const rateLimitMaxRetries = normalizeEnvVarNumber(process.env.RATE_LIMIT_MAX_RETRIES) ?? 5
export const rpcTimeoutSeconds = 90
export const defaultConfigDir = `${os.homedir()}/.hop`
export const defaultConfigFilePath = `${defaultConfigDir}/config.json`
export const defaultKeystoreFilePath = `${defaultConfigDir}/keystore.json`
export const minEthBonderFeeBn = parseEther('0.00001')
export const pendingCountCommitThreshold = normalizeEnvVarNumber(process.env.PENDING_COUNT_COMMIT_THRESHOLD) ?? 921 // 90% of 1024
export const appTld = process.env.APP_TLD ?? 'hop.exchange'
export const expectedNameservers = normalizeEnvVarArray(process.env.EXPECTED_APP_NAMESERVERS)
export const modifiedLiquidityRoutes = process.env.MODIFIED_LIQUIDITY_ROUTES?.split(',') ?? []
export const wsEnabledChains = process.env.WS_ENABLED_CHAINS?.split(',') ?? []
export const BondThreshold = normalizeEnvVarNumber(process.env.BOND_THRESHOLD) ?? DefaultBondThreshold
// TODO: Normalize bool. This will be true if ENFORCE_RELAYER_FEE is set to anything
export const EnforceRelayerFee = !!process.env.ENFORCE_RELAYER_FEE ?? false

// Decreasing SyncCyclesPerFullSync will result in more full syncs (root data) more often. This is useful for the
// available liquidity watcher to have up-to-date info
export const SyncIntervalSec = process.env.SYNC_INTERVAL_SEC ? Number(process.env.SYNC_INTERVAL_SEC) : 30
export const SyncIntervalMultiplier = process.env.SYNC_INTERVAL_MULTIPLIER ? Number(process.env.SYNC_INTERVAL_MULTIPLIER) : 1
export const SyncCyclesPerFullSync = process.env.SYNC_CYCLES_PER_FULL_SYNC ? Number(process.env.SYNC_CYCLES_PER_FULL_SYNC) : 60

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

export type Fees = Record<string, Bps>
export type Routes = Record<string, Record<string, boolean>>
export type CommitTransfersConfig = {
  minThresholdAmount: Record<string, Record<string, Record<string, any>>>
}
type Tokens = Record<string, boolean>

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

export type Config = {
  isMainnet: boolean
  tokens: Tokens
  addresses: Partial<Bridges> & {[network: string]: any}
  network: string
  networks: Networks & {[network: string]: any}
  bonderPrivateKey: string
  metadata: Metadata & {[network: string]: any}
  bonders: Bonders
  bonderConfig: BonderConfig
  db: DbConfig
  sync: SyncConfigs
  metrics: MetricsConfig
  commitTransfers: CommitTransfersConfig
  fees: Fees
  routes: Routes
  signerConfig: SignerConfig
  blocklist: BlocklistConfig
  emergencyDryMode: boolean
}

const networkConfigs: {[key: string]: any} = {}

for (const network in coreNetworks) {
  const { bridges: addresses, bonders } = coreAddresses[network as Network]
  const coreNetwork = coreNetworks[network as Network]
  const bonderConfig: BonderConfig = {}
  const networks: any = {}

  for (const chain in coreNetwork) {
    const chainObj = coreNetwork[chain as Chain]
    if (!networks[chain]) {
      networks[chain] = {}
    }
    networks[chain].name = chainObj?.name
    networks[chain].chainId = chainObj?.networkId
    networks[chain].rpcUrl = chainObj?.publicRpcUrl
    networks[chain].subgraphUrl = chainObj?.subgraphUrl

    bonderConfig.totalStake = coreConfig[network as Network].bonderTotalStake
  }

  const metadata = coreMetadata[network as Network]
  const networkInfo = { addresses, bonders, bonderConfig, networks, metadata }
  networkConfigs[network] = networkInfo
}

const getConfigByNetwork = (network: string): Pick<Config, 'network' | 'addresses' | 'bonders' | 'bonderConfig' | 'networks' | 'metadata' | 'isMainnet'> => {
  const networkConfig = isTestMode ? networkConfigs.test : networkConfigs?.[network]
  if (!networkConfig) {
    throw new Error(`Network config not found for network: ${network}`)
  }

  const { addresses, bonders, bonderConfig, networks, metadata } = networkConfig
  const isMainnet = network === Network.Mainnet

  return {
    network,
    addresses,
    bonders,
    bonderConfig,
    networks,
    metadata,
    isMainnet
  }
}

// get default config
const { addresses, bonders, bonderConfig, network, networks, metadata, isMainnet } = getConfigByNetwork(envNetwork)

// defaults
export const config: Config = {
  isMainnet,
  addresses,
  network,
  networks,
  tokens: {},
  bonderPrivateKey: bonderPrivateKey ?? '',
  metadata,
  bonders,
  bonderConfig,
  fees: {},
  routes: {},
  db: {
    path: defaultDbPath
  },
  sync: {
    [Chain.Ethereum]: {
      totalBlocks: TotalBlocks.Ethereum,
      batchBlocks: 2000
    },
    [Chain.Arbitrum]: {
      totalBlocks: 100_000,
      batchBlocks: DefaultBatchBlocks
    },
    [Chain.Optimism]: {
      totalBlocks: 100_000,
      batchBlocks: 2000
    },
    [Chain.Polygon]: {
      totalBlocks: TotalBlocks.Polygon,
      batchBlocks: 2000
    },
    [Chain.Gnosis]: {
      totalBlocks: TotalBlocks.Gnosis,
      batchBlocks: DefaultBatchBlocks
    },
    [Chain.Nova]: {
      totalBlocks: 100_000,
      batchBlocks: DefaultBatchBlocks
    },
    [Chain.ZkSync]: {
      totalBlocks: 100_000,
      batchBlocks: DefaultBatchBlocks
    },
    [Chain.Linea]: {
      totalBlocks: 100_000,
      batchBlocks: DefaultBatchBlocks
    },
    [Chain.ScrollZk]: {
      totalBlocks: 100_000,
      batchBlocks: DefaultBatchBlocks
    },
    [Chain.Base]: {
      totalBlocks: 100_000,
      batchBlocks: 2000
    },
    [Chain.PolygonZk]: {
      totalBlocks: 100_000,
      batchBlocks: DefaultBatchBlocks
    }
  },
  metrics: {
    enabled: false
  },
  commitTransfers: {
    minThresholdAmount: {}
  },
  signerConfig: {
    type: 'keystore'
  },
  blocklist: {
    path: '',
    addresses: {}
  },
  emergencyDryMode: false
}

export const setConfigByNetwork = (network: string) => {
  const { addresses, networks, metadata, isMainnet } = getConfigByNetwork(network)
  config.isMainnet = isMainnet
  config.addresses = addresses
  config.network = network
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

export const setBonderPrivateKey = (privateKey: string) => {
  config.bonderPrivateKey = privateKey
}

export const setNetworkRpcUrl = (network: string, rpcUrl: string) => {
  if (config.networks[network]) {
    config.networks[network].rpcUrl = rpcUrl
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

export const setNetworkCustomSyncType = (network: string, customSyncType: SyncType) => {
  if (config.networks[network]) {
    config.networks[network].customSyncType = customSyncType
  }
}

export const getNetworkMaxGasPrice = (network: string) => {
  return config.networks[network].maxGasPrice
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
    if (chain === Chain.Ethereum || chain === settlementChain) {
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
  config.signerConfig = { ...config.signerConfig, ...signerConfig }
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
  return config.bonderConfig?.totalStake?.[token as AssetSymbol]
}

const getConfigBondersForToken = (token: string) => {
  return config.bonders?.[token as AssetSymbol]
}

export const getConfigBonderForRoute = (token: string, sourceChain: string, destinationChain: string) => {
  const bonders = getConfigBondersForToken(token)
  const bonder = bonders?.[sourceChain as Chain]?.[destinationChain as Chain]
  return bonder
}

export { Bonders }
export * from './validation'
export * from './fileOps'

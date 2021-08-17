import os from 'os'
import path from 'path'
import { Addresses, Bonders, Bridges } from '@hop-protocol/core/addresses'
import { Chain, DEFAULT_BATCH_BLOCKS, Network, TotalBlocks } from 'src/constants'
import { Tokens as Metadata } from '@hop-protocol/core/metadata'
import { Networks } from '@hop-protocol/core/networks'
import * as goerliConfig from './goerli'
import * as kovanConfig from './kovan'
import * as mainnetConfig from './mainnet'
import * as stagingConfig from './staging'
import * as testConfig from './test'
require('./loadEnvFile')
const defaultDbPath = path.resolve(__dirname, '../../../db_data')

export const ipfsHost = process.env.IPFS_HOST || 'http://127.0.0.1:5001'
export const hostname = process.env.HOSTNAME || os.hostname()
export const slackChannel = process.env.SLACK_CHANNEL
export const slackAuthToken = process.env.SLACK_AUTH_TOKEN
export const slackUsername = process.env.SLACK_USERNAME || 'Hop Node'
const envNetwork = process.env.NETWORK || Network.Kovan
const isTestMode = !!process.env.TEST_MODE
const bonderPrivateKey = process.env.BONDER_PRIVATE_KEY
const relayerPrivateKey = process.env.RELAYER_PRIVATE_KEY

export const rateLimitMaxRetries = 5
export const rpcTimeoutSeconds = 10 * 60
export const defaultConfigDir = `${os.homedir()}/.hop-node`
export const defaultConfigFilePath = `${defaultConfigDir}/config.json`
export const defaultKeystoreFilePath = `${defaultConfigDir}/keystore.json`

type BondWithdrawalConfig = {
  [network: string]: {
    min?: number
    max?: number
  }
}
type BondWithdrawalsConfig = {
  [network: string]: BondWithdrawalConfig
}
type SyncConfig = {
  totalBlocks?: number
  batchBlocks?: number
}
type SyncConfigs = { [key: string]: SyncConfig }
type DbConfig = {
  path: string
}
type Config = {
  isMainnet: boolean
  tokens:Bridges & {[network: string]: any},
  network: string,
  networks: Networks & {[network: string]: any},
  bonderPrivateKey: string,
  relayerPrivateKey: string,
  metadata: Metadata & {[network: string]: any},
  bonders: Bonders,
  stateUpdateAddress: string,
  db: DbConfig,
  sync: SyncConfigs,
  bondWithdrawals: BondWithdrawalsConfig
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

const getConfigByNetwork = (network: string):Partial<Config> => {
  const { addresses: tokens, networks, bonders, metadata } = isTestMode ? networkConfigs.test : (networkConfigs as any)?.[network]
  network = normalizeNetwork(network)
  const isMainnet = network === Network.Mainnet

  // set special rpc urls required for certain events on certain chains
  for (const key in networks) {
    const item = (networks as any)[key] as any
    if (item?.archiveRpcUrls.length) {
      item.readRpcUrl = item.archiveRpcUrls[0]
    }
    if (item?.specialArchiveRpcUrl) {
      item.specialReadRpcUrl = item.specialArchiveRpcUrl
    }
  }

  return {
    network,
    tokens,
    networks,
    bonders,
    metadata,
    isMainnet
  }
}

// get default config
const { tokens, network, networks, metadata, bonders, isMainnet } = getConfigByNetwork(envNetwork)

export const config: Config = {
  isMainnet,
  tokens,
  network,
  networks,
  bonderPrivateKey,
  relayerPrivateKey,
  metadata,
  bonders,
  stateUpdateAddress: '',
  db: {
    path: defaultDbPath
  },
  sync: {
    [Chain.Ethereum]: {
      totalBlocks: TotalBlocks.Ethereum,
      batchBlocks: DEFAULT_BATCH_BLOCKS
    },
    [Chain.Arbitrum]: {
      totalBlocks: 100_000,
      batchBlocks: DEFAULT_BATCH_BLOCKS
    },
    [Chain.Optimism]: {
      totalBlocks: 100_000,
      batchBlocks: DEFAULT_BATCH_BLOCKS
    },
    [Chain.Polygon]: {
      totalBlocks: TotalBlocks.Polygon,
      batchBlocks: DEFAULT_BATCH_BLOCKS
    },
    [Chain.xDai]: {
      totalBlocks: TotalBlocks.xDai,
      batchBlocks: DEFAULT_BATCH_BLOCKS
    }
  },
  bondWithdrawals: {}
}

export const setConfigByNetwork = (network: string) => {
  const { tokens, networks, bonders, metadata, isMainnet } = getConfigByNetwork(network)
  config.isMainnet = isMainnet
  config.tokens = tokens
  config.network = normalizeNetwork(network)
  config.networks = networks
  config.bonders = bonders
  config.metadata = metadata
}

export const setConfigAddresses = (addresses: Addresses) => {
  const { bridges, bonders } = addresses
  config.tokens = bridges
  config.bonders = bonders
}

export const setBonderPrivateKey = (privateKey: string) => {
  config.bonderPrivateKey = privateKey
}

export const setNetworkRpcUrls = (network: string, rpcUrls: string[]) => {
  network = normalizeNetwork(network)
  if (config.networks[network]) {
    config.networks[network].rpcUrls = rpcUrls
  }
}

export const setNetworkWaitConfirmations = (
  network: string,
  waitConfirmations: number
) => {
  if (config.networks[network]) {
    config.networks[network].waitConfirmations = waitConfirmations
  }
}

export const setBondWithdrawalsConfig = (bondWithdrawalsConfig: BondWithdrawalsConfig) => {
  config.bondWithdrawals = bondWithdrawalsConfig
}

export const setStateUpdateAddress = (address: string) => {
  config.stateUpdateAddress = address
}

export const setSyncConfig = (syncConfigs: SyncConfigs = {}) => {
  const networks = Object.keys(config.networks)
  for (const network of networks) {
    if (!config.sync[network]) {
      config.sync[network] = {}
    }
    if (syncConfigs[network]?.totalBlocks) {
      config.sync[network].totalBlocks = syncConfigs[network]?.totalBlocks
    }
    if (syncConfigs[network]?.batchBlocks) {
      config.sync[network].batchBlocks = syncConfigs[network]?.batchBlocks
    }
  }
}

export const setDbPath = (dbPath: string) => {
  config.db.path = dbPath
}

export * from './validation'
export * from './fileOps'

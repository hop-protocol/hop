import Logger, { setLogLevel } from 'src/logger'
import fs from 'fs'
import os from 'os'
import path from 'path'
import {
  Bonders,
  CommitTransfersConfig, Fees, Routes, Watchers,
  defaultConfigFilePath,
  setBonderPrivateKey,
  setCommitTransfersConfig,
  setConfigAddresses,
  setConfigBonders,
  setConfigByNetwork,
  setConfigTokens,
  setDbPath,
  setFeesConfig,
  setMetricsConfig,
  setNetworkMaxGasPrice,
  setNetworkRpcUrl,
  setRoutesConfig,
  setStateUpdateAddress,
  setSyncConfig
} from './config'
import { Chain } from 'src/constants'
import { getParameter } from 'src/aws/parameterStore'
import { promptPassphrase } from 'src/prompt'
import { recoverKeystore } from 'src/keystore'

const logger = new Logger('config')

export const defaultEnabledNetworks: { [key: string]: boolean } = {
  [Chain.Optimism]: true,
  [Chain.Arbitrum]: true,
  [Chain.xDai]: true,
  [Chain.Polygon]: true,
  [Chain.Ethereum]: true
}

type ChainsConfig = {
  [key: string]: any
}

type TokensConfig = {
  [key: string]: boolean
}

type SyncConfig = {
  [key: string]: any
}

type WatchersConfig = {
  [Watchers.BondTransferRoot]: boolean
  [Watchers.BondWithdrawal]: boolean
  [Watchers.Challenge]: boolean
  [Watchers.CommitTransfers]: boolean
  [Watchers.SettleBondedWithdrawals]: boolean
  [Watchers.xDomainMessageRelay]: boolean
}

type DbConfig = {
  location: string
}

type KeystoreConfig = {
  location: string
  pass?: string
  passwordFile?: string
  parameterStore?: string
  awsRegion?: string
}

type LoggingConfig = {
  level: string
}

type MetricsConfig = {
  enabled: boolean
  port?: number
}

export type Addresses = {
  location: string
}

export type FileConfig = {
  network: string
  chains: ChainsConfig
  tokens: TokensConfig
  watchers: Partial<WatchersConfig>
  sync?: SyncConfig
  db?: DbConfig
  logging?: LoggingConfig
  keystore?: KeystoreConfig
  settleBondedWithdrawals?: any
  commitTransfers?: CommitTransfersConfig
  addresses?: Addresses
  stateUpdateAddress?: string
  metrics?: MetricsConfig
  fees?: Fees
  routes: Routes
  bonders?: Bonders
}

export async function setGlobalConfigFromConfigFile (
  config: Partial<FileConfig> = {},
  passwordFile: string = ''
) {
  if (config.db) {
    const dbPath = config.db.location
    if (dbPath) {
      setDbPath(dbPath)
    }
  }
  if (config.logging?.level) {
    const logLevel = config.logging.level
    logger.info(`log level: "${logLevel}"`)
    setLogLevel(logLevel)
  }
  if (config.keystore) {
    if (!config.keystore.location) {
      throw new Error('config for keystore location is required')
    }
    const filepath = path.resolve(
      config.keystore.location.replace('~', os.homedir())
    )
    const keystore = JSON.parse(fs.readFileSync(path.resolve(filepath), 'utf8'))
    let passphrase = process.env.KEYSTORE_PASS ?? config.keystore.pass
    if (!passphrase) {
      let passwordFilePath = passwordFile ?? config.keystore.passwordFile
      const parameterStoreName = config.keystore.parameterStore
      const awsRegion = config.keystore.awsRegion
      if (passwordFilePath) {
        passwordFilePath = path.resolve(
          passwordFilePath.replace('~', os.homedir())
        )
        passphrase = fs.readFileSync(passwordFilePath, 'utf8').trim()
      } else if (parameterStoreName) {
        passphrase = await getParameter(parameterStoreName, awsRegion)
      } else {
        passphrase = (await promptPassphrase()) as string
      }
    }
    const privateKey = await recoverKeystore(keystore, passphrase)
    setBonderPrivateKey(privateKey)
  }
  const network = config.network
  if (!network) {
    throw new Error('config for network is required')
  }
  logger.info(`network: "${network}"`)
  setConfigByNetwork(network)

  if (!config.chains) {
    throw new Error('config for chains is required')
  }

  for (const k in config.chains) {
    const v = config.chains[k]
    if (v instanceof Object) {
      const { rpcUrl, maxGasPrice } = v
      if (rpcUrl) {
        setNetworkRpcUrl(k, rpcUrl)
      }
      if (maxGasPrice) {
        setNetworkMaxGasPrice(k, maxGasPrice)
      }
    }
  }

  if (!config.tokens) {
    throw new Error('config for tokens is required')
  }

  setConfigTokens(config.tokens)

  if (config.sync) {
    setSyncConfig(config.sync)
  }
  if (config.addresses?.location) {
    const location = path.resolve(config.addresses.location.replace('~', os.homedir()))
    if (!fs.existsSync(location)) {
      throw new Error(`no config file found at ${location}`)
    }
    const addresses = require(location) // eslint-disable-line @typescript-eslint/no-var-requires
    setConfigAddresses(addresses)
  }
  if (config.stateUpdateAddress) {
    setStateUpdateAddress(config.stateUpdateAddress)
  }
  if (config?.metrics) {
    setMetricsConfig(config.metrics)
  }
  if (!config?.routes) {
    throw new Error('config for routes is required')
  }
  const numRoutes = Object.keys(config.routes).length
  if (!numRoutes) {
    throw new Error('1 or more routes must be specified')
  }
  if (!config?.watchers) {
    throw new Error('config for watchers is required')
  }

  const enabledWatchers = Object.keys(config?.watchers).filter((watcher: string) => (config?.watchers as any)?.[watcher])
  if (!config?.watchers) {
    throw new Error('config for watchers is required')
  }

  setRoutesConfig(config.routes)
  if (enabledWatchers.includes(Watchers.BondWithdrawal) && !config?.fees) {
    throw new Error('config for fees is required')
  }

  if (config.fees != null) {
    setFeesConfig(config.fees)
  }

  if (enabledWatchers.includes(Watchers.CommitTransfers) && !config?.commitTransfers) {
    throw new Error('config for commitTransfers is required')
  }

  if (config.commitTransfers && !config.commitTransfers?.minThresholdAmount) {
    throw new Error('config for commitTransfers.minThresholdAmount is required')
  }

  if (config.commitTransfers != null) {
    setCommitTransfersConfig(config.commitTransfers)
  }

  if (config.bonders) {
    setConfigBonders(config.bonders)
  }
}

export async function writeConfigFile (
  config: FileConfig,
  configPath: string = defaultConfigFilePath
) {
  if (!configPath) {
    throw new Error('config filepath is required')
  }

  if (fs.existsSync(configPath)) {
    const backupFilepath = `/tmp/config.${Date.now()}.json`
    const currentConfig = await parseConfigFile(configPath)
    fs.writeFileSync(backupFilepath, JSON.stringify(currentConfig, null, 2))
    logger.debug(`backed up current config file to ${backupFilepath}`)
  }

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
  logger.debug(`wrote config file to ${configPath}`)
}

export async function parseConfigFile (
  _configFile: string = defaultConfigFilePath
) {
  const configPath = path.resolve(_configFile.replace('~', os.homedir()))
  let config: FileConfig | null = null
  if (configPath) {
    if (!fs.existsSync(configPath)) {
      throw new Error(`no config file found at ${configPath}`)
    }

    config = require(configPath)
  }
  if (config != null) {
    logger.info('config file:', configPath)
    return config
  }
}

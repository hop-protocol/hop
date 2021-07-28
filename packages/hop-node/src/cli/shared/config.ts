import fs from 'fs'
import os from 'os'
import path from 'path'
import yaml from 'js-yaml'
import { Chain } from 'src/constants'
import {
  db as dbConfig,
  setBonderPrivateKey,
  setConfigAddresses,
  setConfigByNetwork,
  setSyncConfig
} from 'src/config'
import { getParameter } from 'src/aws/parameterStore'
import { logger, prompt } from './shared'
import { recoverKeystore } from 'src/keystore'
import { setLogLevel } from 'src/logger'

export const defaultConfigDir = `${os.homedir()}/.hop-node`
export const defaultConfigFilePath = `${defaultConfigDir}/config.json`
export const defaultKeystoreFilePath = `${defaultConfigDir}/keystore.json`

export const defaultEnabledWatchers: { [key: string]: boolean } = {
  bondTransferRoot: true,
  bondWithdrawal: true,
  challenge: true, // only active if role.challenger is also true
  commitTransfers: true,
  settleBondedWithdrawals: true,
  stake: true,
  xDomainMessageRelay: false
}

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

type RolesConfig = {
  bonder?: boolean
  challenger?: boolean
  arbBot?: boolean
  xdaiBridge?: boolean
}

type WatchersConfig = {
  bondTransferRoot: boolean
  bondWithdrawal: boolean
  challenge: boolean
  commitTransfers: boolean
  settleBondedWithdrawals: boolean
  stake: boolean
  xDomainMessageRelay: boolean
}

type DbConfig = {
  location: string
}

type KeystoreConfig = {
  location: string
  pass?: string
  passwordFile?: string
  parameterStore?: string
}

type LoggingConfig = {
  level: string
}

export type BondWithdrawals = {
  [chain: string]: {
    [token: string]: {
      min?: number
      max?: number
    }
  }
}

export type Addresses = {
  location: string
}

export type Config = {
  network?: string
  chains?: ChainsConfig
  tokens?: TokensConfig
  roles?: RolesConfig
  watchers?: Partial<WatchersConfig>
  sync?: SyncConfig
  db?: DbConfig
  logging?: LoggingConfig
  keystore?: KeystoreConfig
  stake?: any
  settleBondedWithdrawals?: any
  commitTransfers?: any
  bondWithdrawals?: BondWithdrawals
  order?: number
  addresses?: Addresses
}

export async function writeConfigFile (
  config: Config,
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
  let config: Config | null = null
  if (configPath) {
    if (!fs.existsSync(configPath)) {
      throw new Error(`no config file found at ${configPath}`)
    }

    if (configPath.endsWith('.yml') || configPath.endsWith('.yaml')) {
      config = yaml.load(fs.readFileSync(configPath, 'utf8')) as any
    } else {
      config = require(configPath)
    }
  }
  if (config) {
    await validateConfig(config)
    logger.info('config file:', configPath)
  }

  return config
}

export async function setGlobalConfigFromConfigFile (
  config: Config = {},
  passwordFile: string = ''
) {
  if (config?.db) {
    const dbPath = config?.db?.location
    if (dbPath) {
      dbConfig.path = dbPath
    }
  }
  if (config?.logging?.level) {
    const logLevel = config.logging.level
    logger.info(`log level: "${logLevel}"`)
    setLogLevel(logLevel)
  }
  if (config?.keystore) {
    if (!config.keystore.location) {
      throw new Error('keystore location is required')
    }
    const filepath = path.resolve(
      config.keystore.location.replace('~', os.homedir())
    )
    const keystore = JSON.parse(fs.readFileSync(path.resolve(filepath), 'utf8'))
    let passphrase: string = process.env.KEYSTORE_PASS || config?.keystore.pass
    if (!passphrase) {
      let passwordFilePath = passwordFile || config?.keystore?.passwordFile
      const parameterStoreName = config?.keystore?.parameterStore
      if (passwordFilePath) {
        passwordFilePath = path.resolve(
          passwordFilePath.replace('~', os.homedir())
        )
        passphrase = fs.readFileSync(passwordFilePath, 'utf8').trim()
      } else if (parameterStoreName) {
        passphrase = await getParameter(parameterStoreName)
      } else {
        passphrase = (await promptPassphrase()) as string
      }
    }
    const privateKey = await recoverKeystore(keystore, passphrase as string)
    setBonderPrivateKey(privateKey)
  }
  if (config?.network) {
    const network = config.network
    logger.info(`network: "${network}"`)
    setConfigByNetwork(network)
  }
  if (config?.sync) {
    setSyncConfig(config?.sync)
  }
  if (config?.addresses && config?.addresses.location) {
    const location = path.resolve(config?.addresses.location.replace('~', os.homedir()))
    if (!fs.existsSync(location)) {
      throw new Error(`no config file found at ${location}`)
    }
    const addresses = require(location)
    setConfigAddresses(addresses)
  }
}

export function validateKeys (validKeys: string[] = [], keys: string[]) {
  for (const key of keys) {
    if (!validKeys.includes(key)) {
      throw new Error(`unrecognized key "${key}"`)
    }
  }
}

export async function validateConfig (config: any) {
  if (!config) {
    throw new Error('config is required')
  }

  if (!(config instanceof Object)) {
    throw new Error('config must be a JSON object')
  }

  const validSectionKeys = [
    'network',
    'chains',
    'sync',
    'tokens',
    'stake',
    'commitTransfers',
    'bondWithdrawals',
    'settleBondedWithdrawals',
    'roles',
    'watchers',
    'db',
    'logging',
    'keystore',
    'addresses',
    'order'
  ]

  const validWatcherKeys = [
    'bondTransferRoot',
    'bondWithdrawal',
    'challenge',
    'commitTransfers',
    'settleBondedWithdrawals',
    'stake',
    'xDomainMessageRelay'
  ]

  const sectionKeys = Object.keys(config)
  await validateKeys(validSectionKeys, sectionKeys)

  if (config.chains) {
    const validNetworkKeys = [
      Chain.Ethereum,
      Chain.Optimism,
      Chain.Arbitrum,
      Chain.xDai,
      Chain.Polygon
    ]
    const networkKeys = Object.keys(config.chains)
    await validateKeys(validNetworkKeys, networkKeys)
  }

  if (config.roles) {
    const validRoleKeys = ['bonder', 'challenger', 'arbBot', 'xdaiBridge']
    const roleKeys = Object.keys(config.roles)
    await validateKeys(validRoleKeys, roleKeys)
  }

  if (config.watchers) {
    const watcherKeys = Object.keys(config.watchers)
    await validateKeys(validWatcherKeys, watcherKeys)
  }

  if (config.db) {
    const validDbKeys = ['location']
    const dbKeys = Object.keys(config.db)
    await validateKeys(validDbKeys, dbKeys)
  }

  if (config.logging) {
    const validLoggingKeys = ['level']
    const loggingKeys = Object.keys(config.logging)
    await validateKeys(validLoggingKeys, loggingKeys)

    if (config?.logging?.level) {
      const validLoggingLevels = ['debug', 'info', 'warn', 'error']
      await validateKeys(validLoggingLevels, [config?.logging?.level])
    }
  }

  if (config.keystore) {
    const validKeystoreProps = [
      'location',
      'pass',
      'passwordFile',
      'parameterStore'
    ]
    const keystoreProps = Object.keys(config.keystore)
    await validateKeys(validKeystoreProps, keystoreProps)
  }

  if (config.commitTransfers) {
    const validCommitTransfersKeys = ['minThresholdAmount']
    const commitTransfersKeys = Object.keys(config.commitTransfers)
    await validateKeys(validCommitTransfersKeys, commitTransfersKeys)
  }

  if (config.addresses) {
    const validAddressesProps = [
      'location'
    ]
    const addressesProps = Object.keys(config.addresses)
    await validateKeys(validAddressesProps, addressesProps)
  }
}

export async function promptPassphrase (
  message: string = 'keystore passphrase'
) {
  prompt.start()
  prompt.message = ''
  prompt.delimiter = ':'
  const { passphrase } = await prompt.get({
    properties: {
      passphrase: {
        message,
        hidden: true
      }
    }
  } as any)
  return passphrase
}

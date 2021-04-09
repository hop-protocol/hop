import '../moduleAlias'
import os from 'os'
import fs from 'fs'
import path from 'path'
import { Command } from 'commander'
import prompt from 'prompt'
import {
  db as dbConfig,
  setConfigByNetwork,
  setBonderPrivateKey
} from 'src/config'
import Logger, { setLogLevel } from 'src/logger'
import { ETHEREUM, OPTIMISM, ARBITRUM, XDAI } from 'src/constants'
import arbbots from 'src/arb-bot/bots'
import {
  startWatchers,
  startStakeWatchers,
  startChallengeWatchers,
  startCommitTransferWatchers
} from 'src/watchers/watchers'
import xDaiBridgeWatcher from 'src/watchers/xDaiBridgeWatcher'
import { generateKeystore, recoverKeystore } from 'src/keystore'

const logger = new Logger('config')
const program = new Command()

type NetworksConfig = {
  [key: string]: any
}

type TokensConfig = {
  [key: string]: boolean
}

type RolesConfig = {
  bonder?: boolean
  challenger?: boolean
  arbBot?: boolean
}

type DbConfig = {
  location: string
}

type KeystoreConfig = {
  location: string
  pass?: string
}

type LoggingConfig = {
  level: string
}

type Config = {
  network?: string
  networks?: NetworksConfig
  tokens?: TokensConfig
  roles?: RolesConfig
  db?: DbConfig
  logging?: LoggingConfig
  keystore?: KeystoreConfig
}

program
  .description('Start Hop node')
  .option('-c, --config <filepath>', 'Config file to use')
  .action(async source => {
    try {
      const config: any = await setupConfig(source.config)
      if (config?.logging?.level) {
        const logLevel = config.logging.level
        logger.log(`log level: "${logLevel}"`)
        setLogLevel(logLevel)
      }
      if (config?.keystore) {
        const filepath = path.resolve(
          config.keystore.location.replace('~', os.homedir())
        )
        const keystore = JSON.parse(
          fs.readFileSync(path.resolve(filepath), 'utf8')
        )
        let passphrase = config?.keystore.pass
        if (!passphrase) {
          passphrase = await promptPassphrase()
        }
        const privateKey = await recoverKeystore(keystore, passphrase as string)
        setBonderPrivateKey(privateKey)
      }
      if (config?.network) {
        const network = config.network
        logger.log(`network: "${network}"`)
        setConfigByNetwork(network)
      }
      const tokens = Object.keys(config?.tokens || {})
      const networks = Object.keys(config?.networks || {})
      const bonder = config?.roles?.bonder
      const challenger = config?.roles?.challenger
      startWatchers({
        order: 0,
        tokens,
        networks,
        bonder,
        challenger
      })
      if (config?.roles?.arbBot) {
        const maxTradeAmount = 0
        const minThreshold = 0
        arbbots.start({
          maxTradeAmount,
          minThreshold
        })
      }
      if (config?.roles?.xdaiBridge) {
        new xDaiBridgeWatcher().start()
      }
    } catch (err) {
      console.error(err.message)
    }
  })

program
  .command('bonder')
  .option('-o, --order <order>', 'Bonder order')
  .option(
    '-t, --tokens <symbol>',
    'List of token by symbol to bond, comma separated'
  )
  .option('--l1-network <network>', 'L1 network')
  .option(
    '-n, --networks <network>',
    'List of networks to bond, comma separated'
  )
  .description('Start the bonder watchers')
  .action(source => {
    try {
      if (source.l1Network) {
        logger.log(`network: "${source.l1Network}"`)
        setConfigByNetwork(source.l1Network)
      }
      const order = Number(source.order) || 0
      const tokens = parseArgList(source.tokens).map((value: string) =>
        value.toUpperCase()
      )
      const networks = parseArgList(source.networks).map((value: string) =>
        value.toLowerCase()
      )
      startWatchers({
        order,
        tokens,
        networks
      })
    } catch (err) {
      console.error(err.message)
    }
  })

program
  .command('xdai-bridge')
  .description('Start the xDai bridge watcher')
  .action(() => {
    try {
      new xDaiBridgeWatcher().start()
    } catch (err) {
      console.error(err.message)
    }
  })

program
  .command('challenger')
  .description('Start the challenger watcher')
  .action(async () => {
    try {
      await startChallengeWatchers()
    } catch (err) {
      console.error(err.message)
    }
  })

program
  .command('relayer')
  .description('Start the relayer watcher')
  .action(async () => {
    try {
      await startCommitTransferWatchers()
    } catch (err) {
      console.error(err.message)
    }
  })

program
  .command('arb-bot')
  .description('Start the arbitrage bot')
  .option('--max-trade-amount <number>', 'Max trade amount')
  .option('--min-threshold <number>', 'Min threshold')
  .action(source => {
    try {
      const maxTradeAmount = Number(source.maxTradeAmount) || 0
      const minThreshold = Number(source.minThreshold) || 0
      arbbots.start({
        maxTradeAmount,
        minThreshold
      })
    } catch (err) {
      console.error(err.message)
    }
  })

program
  .command('xdai-bridge')
  .description('Start the xDai bridge watcher')
  .action(() => {
    try {
      new xDaiBridgeWatcher().start()
    } catch (err) {
      console.error(err.message)
    }
  })

program
  .command('stake')
  .description('Start the stake watcher')
  .action(async source => {
    try {
      await startStakeWatchers()
    } catch (err) {
      console.error(err.message)
    }
  })

program
  .command('keystore')
  .description('Keystore')
  .option('--pass <passphrase>', 'Keystore passphrase to encrypt with')
  .option('-o, --output <output>', 'Output file path')
  .option('--private-key <private-key>', 'Private key')
  .action(async source => {
    try {
      const action = source.args[0]
      let passphrase = source.pass
      const output = source.output
      if (!action) {
        console.error(`please specify subcommand`)
        return
      }
      if (action === 'generate') {
        if (!passphrase) {
          passphrase = await promptPassphrase()
        }
        const privateKey: string | null = source.privateKey || null
        const keystore = await generateKeystore(privateKey, passphrase)
        const filepath = path.resolve(output)
        fs.writeFileSync(filepath, JSON.stringify(keystore), 'utf8')
        console.log(`wrote to ${filepath}`)
      } else if (action === 'decrypt') {
        if (!passphrase) {
          passphrase = await promptPassphrase()
        }
        const filepath = source.args[1]
        if (!filepath) {
          console.error('please specify filepath')
          return
        }
        const keystore = JSON.parse(
          fs.readFileSync(path.resolve(filepath), 'utf8')
        )
        const privateKey = await recoverKeystore(keystore, passphrase)
        console.log(privateKey)
      } else {
        console.log(`unsupported command: "${action}"`)
      }
    } catch (err) {
      console.error(err.message)
    }
  })

program.parse(process.argv)

function parseArgList (arg: string) {
  return (arg || '')
    .split(',')
    .map((value: string) => value.trim())
    .filter((value: string) => value)
}

function validateKeys (validKeys: string[], keys: string[]) {
  for (let key of keys) {
    if (!validKeys.includes(key)) {
      throw new Error(`unrecognized key "${key}"`)
    }
  }
}

async function validateConfig (config: any) {
  if (!config) {
    throw new Error('config is required')
  }

  if (!(config instanceof Object)) {
    throw new Error('config must be a JSON object')
  }

  const validSectionKeys = [
    'network',
    'networks',
    'tokens',
    'roles',
    'db',
    'logging',
    'keystore'
  ]
  const sectionKeys = Object.keys(config)
  await validateKeys(validSectionKeys, sectionKeys)

  if (config['networks']) {
    const validNetworkKeys = [ETHEREUM, OPTIMISM, ARBITRUM, XDAI]
    const networkKeys = Object.keys(config['networks'])
    await validateKeys(validNetworkKeys, networkKeys)
  }

  if (config['roles']) {
    const validRoleKeys = ['bonder', 'challenger', 'arbBot', 'xdaiBridge']
    const roleKeys = Object.keys(config['roles'])
    await validateKeys(validRoleKeys, roleKeys)
  }

  if (config['db']) {
    const validDbKeys = ['location']
    const dbKeys = Object.keys(config['db'])
    await validateKeys(validDbKeys, dbKeys)
  }

  if (config['logging']) {
    const validLoggingKeys = ['level']
    const loggingKeys = Object.keys(config['logging'])
    await validateKeys(validLoggingKeys, loggingKeys)

    if (config?.logging?.level) {
      const validLoggingLevels = ['debug', 'info', 'warn', 'error']
      await validateKeys(validLoggingLevels, [config?.logging?.level])
    }
  }

  if (config['keystore']) {
    const validKeystoreProps = ['location', 'pass']
    const keystoreProps = Object.keys(config['keystore'])
    await validateKeys(validKeystoreProps, keystoreProps)
  }
}

async function setupConfig (_configFile?: string) {
  let configPath = ''
  if (_configFile) {
    configPath = path.resolve(_configFile.replace('~', os.homedir()))
  }
  let config: Config | null = null
  if (configPath) {
    if (!fs.existsSync(configPath)) {
      throw new Error(`no config file found at ${configPath}`)
    }
    config = require(configPath)
  }
  if (config) {
    await validateConfig(config)
    logger.log('config file:', configPath)
  }

  if (config?.db) {
    const dbPath = config?.db?.location
    if (dbPath) {
      dbConfig.path = dbPath
    }
  }
  return config
}

async function promptPassphrase () {
  prompt.start()
  prompt.message = ''
  prompt.delimiter = ':'
  const { passphrase } = await prompt.get({
    properties: {
      passphrase: {
        message: 'keystore passphrase',
        hidden: true
      }
    }
  } as any)
  return passphrase
}

process.on('SIGINT', () => {
  process.exit(0)
})

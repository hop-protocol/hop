import '../moduleAlias'
import os from 'os'
import fs from 'fs'
import path from 'path'
import { Command } from 'commander'
import { db as dbConfig } from 'src/config'
import Logger, { setLogLevel } from 'src/logger'
import arbbots from 'src/arb-bot/bots'
import {
  startWatchers,
  startStakeWatchers,
  startChallengeWatchers,
  startCommitTransferWatchers
} from 'src/watchers/watchers'
import xDaiBridgeWatcher from 'src/watchers/xDaiBridgeWatcher'

const logger = new Logger('config')
const program = new Command()

type Config = {
  networks: any
  tokens: any
  roles: any
  db: any
  logging: any
}

program
  .description('Start Hop node')
  .option('-c, --config <filepath>', 'Config file to use')
  .action(async source => {
    const config: any = await setupConfig(source.config)
    if (config?.logging?.level) {
      const logLevel = config.logging.level
      logger.log(`log level: "${logLevel}"`)
      setLogLevel(logLevel)
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
  })

program
  .command('bonder')
  .option('-o, --order <order>', 'Bonder order')
  .option(
    '-t, --tokens <symbol>',
    'List of token by symbol to bond, comma separated'
  )
  .option(
    '-n, --networks <network>',
    'List of networks to bond, comma separated'
  )
  .description('Start the bonder watchers')
  .action(source => {
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
  })

program
  .command('xdai-bridge')
  .description('Start the xDai bridge watcher')
  .action(() => {
    new xDaiBridgeWatcher().start()
  })

program
  .command('challenger')
  .description('Start the challenger watcher')
  .action(() => {
    startChallengeWatchers()
  })

program
  .command('relayer')
  .description('Start the relayer watcher')
  .action(() => {
    startCommitTransferWatchers()
  })

program
  .command('arb-bot')
  .description('Start the arbitrage bot')
  .option('--max-trade-amount <number>', 'Max trade amount')
  .option('--min-threshold <number>', 'Min threshold')
  .action(source => {
    const maxTradeAmount = Number(source.maxTradeAmount) || 0
    const minThreshold = Number(source.minThreshold) || 0
    arbbots.start({
      maxTradeAmount,
      minThreshold
    })
  })

program
  .command('xdai-bridge')
  .description('Start the xDai bridge watcher')
  .action(() => {
    new xDaiBridgeWatcher().start()
  })
program
  .command('stake')
  .description('Start the stake watcher')
  .action(source => {
    startStakeWatchers()
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

  const validSectionKeys = ['networks', 'tokens', 'roles', 'db', 'logging']
  const sectionKeys = Object.keys(config)
  await validateKeys(validSectionKeys, sectionKeys)

  if (config['networks']) {
    const validNetworkKeys = [
      'kovan',
      'mainnet',
      'optimism',
      'arbitrum',
      'xdai'
    ]
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

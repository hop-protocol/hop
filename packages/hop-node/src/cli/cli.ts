import '../moduleAlias'
// @ts-ignore
import clearConsole from 'console-clear'
import os from 'os'
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import { Command } from 'commander'
import { randomBytes } from 'crypto'
import { HDNode } from '@ethersproject/hdnode'
import prompt from 'prompt'
import {
  config as globalConfig,
  db as dbConfig,
  setConfigByNetwork,
  setBonderPrivateKey,
  setNetworkRpcUrls,
  setNetworkWaitConfirmations,
  setSyncConfig,
  slackAuthToken,
  slackChannel,
  slackUsername
} from 'src/config'
import db from 'src/db'
import { getParameter } from 'src/aws/parameterStore'
import clearDb from 'src/db/clearDb'
import Logger, { setLogLevel } from 'src/logger'
import { Chain } from 'src/constants'
import arbbots from 'src/arb-bot/bots'
import {
  getStakeWatchers,
  startWatchers,
  startStakeWatchers,
  startChallengeWatchers,
  startCommitTransferWatchers
} from 'src/watchers/watchers'
import xDaiBridgeWatcher from 'src/watchers/xDaiBridgeWatcher'
import PolygonBridgeWatcher from 'src/watchers/PolygonBridgeWatcher'
import StakeWatcher from 'src/watchers/StakeWatcher'
import LoadTest from 'src/loadTest'
import HealthCheck from 'src/health/HealthCheck'
import { generateKeystore, recoverKeystore } from 'src/keystore'
import entropyToMnemonic from 'src/utils/entropyToMnemonic'
import { hopArt, printHopArt } from './art'
import contracts from 'src/contracts'
import Token from 'src/watchers/classes/Token'

const defaultConfigDir = `${os.homedir()}/.hop-node`
const defaultConfigFilePath = `${defaultConfigDir}/config.json`
const defaultKeystoreFilePath = `${defaultConfigDir}/keystore.json`
const logger = new Logger('config')
const program = new Command()

prompt.colors = false

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

type Config = {
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
  bondWithdrawals?: any
  order?: number
}

let enabledWatchers = [
  'bondTransferRoot',
  'bondWithdrawal',
  'challenge',
  'commitTransfers',
  'settleBondedWithdrawals',
  'stake'
]

program
  .description('Start Hop node')
  .option(
    '-c, --config <string>',
    'Config file to use. Can be in JSON or YAML format'
  )
  .option('--env <string>', 'Environment variables file')
  .option(
    '-d, --dry',
    'Start in dry mode. If enabled, no transactions will be sent.'
  )
  .option(
    '--password-file <string>',
    'File containing password to unlock keystore'
  )
  .option('--clear-db', 'Clear cache database on start')
  .action(async (source: any) => {
    try {
      printHopArt()

      const configFilePath = source.config || source.args[0]
      const config: Config = await parseConfigFile(configFilePath)
      await setGlobalConfigFromConfigFile(config, source.passwordFile)
      if (source.clearDb) {
        await clearDb()
        logger.debug(`cleared db at: ${dbConfig.path}`)
      }

      const tokens = []
      if (config?.tokens) {
        for (let k in config.tokens) {
          const v = config.tokens[k]
          if (v) {
            tokens.push(k)
          }
        }
      }

      const networks = []
      if (config?.chains) {
        for (let k in config.chains) {
          networks.push(k)
          const v = config.chains[k]
          if (v instanceof Object) {
            let _rpcUrls: string[] = []
            const { rpcUrl, rpcUrls, waitConfirmations } = v
            if (rpcUrl) {
              _rpcUrls.push(rpcUrl)
            } else if (rpcUrls.length) {
              _rpcUrls.push(...rpcUrls)
            }
            if (_rpcUrls.length) {
              setNetworkRpcUrls(k, _rpcUrls)
            }
            if (typeof waitConfirmations === 'number') {
              setNetworkWaitConfirmations(k, waitConfirmations)
            }
          }
        }
      }

      const bonder = config?.roles?.bonder
      const challenger = config?.roles?.challenger
      const order = Number(config?.order || 0)
      if (order) {
        logger.info('order:', order)
      }
      let maxStakeAmounts: any
      if (config?.stake) {
        maxStakeAmounts = config.stake
      }
      let commitTransfersMinThresholdAmounts: any = {}
      if (config?.commitTransfers) {
        if (config?.commitTransfers?.minThresholdAmount) {
          commitTransfersMinThresholdAmounts =
            config?.commitTransfers?.minThresholdAmount
        }
      }
      let bondWithdrawalAmounts: any = {}
      if (config?.bondWithdrawals) {
        bondWithdrawalAmounts = config.bondWithdrawals
      }
      let settleBondedWithdrawalsThresholdPercent: any = {}
      if (config?.settleBondedWithdrawals) {
        if (config?.settleBondedWithdrawals?.thresholdPercent) {
          settleBondedWithdrawalsThresholdPercent =
            config?.settleBondedWithdrawals?.thresholdPercent
        }
      }
      const slackEnabled = slackAuthToken && slackChannel && slackUsername
      if (slackEnabled) {
        logger.debug(`slack notifications enabled. channel #${slackChannel}`)
      }
      for (let k in globalConfig.networks) {
        const { waitConfirmations, rpcUrls } = globalConfig.networks[k]
        logger.info(`${k} wait confirmations: ${waitConfirmations || 0}`)
        logger.info(`${k} rpc: ${rpcUrls?.join(',')}`)
      }
      const dryMode = !!source.dry
      if (dryMode) {
        logger.warn(`dry mode enabled`)
      }
      if (config?.watchers) {
        for (let key in config.watchers) {
          if (!(config.watchers as any)[key]) {
            enabledWatchers = enabledWatchers.filter(watcher => watcher !== key)
          }
        }
      }
      startWatchers({
        enabledWatchers,
        order,
        tokens,
        networks,
        bonder,
        challenger,
        maxStakeAmounts,
        commitTransfersMinThresholdAmounts,
        bondWithdrawalAmounts,
        settleBondedWithdrawalsThresholdPercent,
        dryMode
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
        for (let token of tokens) {
          new xDaiBridgeWatcher({
            token
          }).start()
        }
      }
    } catch (err) {
      logger.error(`hop-node error: ${err.message}`)
      process.exit(1)
    }
  })

program
  .command('bonder')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option('-o, --order <number>', 'Bonder order')
  .option(
    '-t, --tokens <string>',
    'List of token by symbol to bond, comma separated'
  )
  .option('--l1-network <network>', 'L1 network')
  .option('-c, --chains <network>', 'List of chains to bond, comma separated')
  .description('Start the bonder watchers')
  .action(async source => {
    try {
      printHopArt()
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config: Config = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      if (source.l1Network) {
        logger.info(`network: "${source.l1Network}"`)
        setConfigByNetwork(source.l1Network)
      }
      const order = Number(source.order || 0)
      logger.info('order:', order)
      const tokens = parseArgList(source.tokens).map((value: string) =>
        value.toUpperCase()
      )
      const networks = parseArgList(source.chains).map((value: string) =>
        value.toLowerCase()
      )
      startWatchers({
        enabledWatchers,
        order,
        tokens,
        networks
      })
    } catch (err) {
      logger.error(err.message)
      process.exit(1)
    }
  })

async function withdrawTokens (
  network: string,
  chain: string,
  token: string,
  amount: number,
  recipient: string,
  isHToken: boolean = false
) {
  if (!recipient) {
    throw new Error('recipient address is required')
  }
  if (!amount) {
    throw new Error('amount is required. E.g. 100')
  }
  if (!token) {
    throw new Error('token is required')
  }
  const tokenContracts = contracts.get(token, chain)
  if (!tokenContracts) {
    throw new Error('token contracts not found')
  }
  let instance: Token
  if (chain === Chain.Ethereum) {
    instance = new Token(tokenContracts.l1CanonicalToken)
  } else {
    if (isHToken) {
      instance = new Token(tokenContracts.l2HopBridgeToken)
    } else {
      instance = new Token(tokenContracts.l2CanonicalToken)
    }
  }

  let balance = await instance.getBalance()
  const label = `${chain}.${isHToken ? 'h' : ''}${token}`
  logger.debug(`${label} balance: ${await instance.formatUnits(balance)}`)
  const parsedAmount = await instance.parseUnits(amount)
  if (balance.lt(parsedAmount)) {
    throw new Error('not enough token balance to send')
  }
  logger.debug(`attempting to send ${amount} ${label} to ${recipient}`)
  const tx = await instance.transfer(recipient, parsedAmount)
  logger.info(`transfer tx: ${tx.hash}`)
  await tx.wait()
  balance = await instance.getBalance()
  logger.debug(`${label} balance: ${await instance.formatUnits(balance)}`)
}

enum StakerAction {
  Stake,
  Unstake,
  Status
}

async function staker (
  network: string,
  chain: string,
  token: string,
  amount: number,
  action: StakerAction
) {
  setConfigByNetwork(network)
  if (!network) {
    throw new Error('network is required. Options are: kovan, goerli, mainnet')
  }
  if (!chain) {
    throw new Error(
      'chain is required. Options are: ethereum, xdai, polygon, optimism, arbitrum'
    )
  }
  if (!token) {
    throw new Error(
      'token is required: Options are: USDC, DAI, etc... Use correct capitalization.'
    )
  }

  const watchers = getStakeWatchers(
    [token],
    [Chain.Optimism, Chain.Arbitrum, Chain.xDai, Chain.Polygon]
  )
  const stakeWatcher = watchers[0].getSiblingWatcherByChainSlug(chain)
  if (action === StakerAction.Stake) {
    logger.debug('action: stake')
    if (!amount) {
      throw new Error('amount is required. E.g. 100')
    }
    const parsedAmount = stakeWatcher.bridge.parseUnits(amount)
    await stakeWatcher.approveTokens()
    await stakeWatcher.convertAndStake(parsedAmount)
  } else if (action === StakerAction.Unstake) {
    logger.debug('action: unstake')
    if (!amount) {
      throw new Error('amount is required. E.g. 100')
    }
    const parsedAmount = stakeWatcher.bridge.parseUnits(amount)
    await stakeWatcher.unstake(parsedAmount)
  } else {
    await stakeWatcher.printAmounts()
  }
}

program
  .command('stake')
  .description('Stake amount')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option('-n, --network <string>', 'Network')
  .option('-c, --chain <string>', 'Chain')
  .option('-t, --token <string>', 'Token')
  .option('-a, --amount <number>', 'Amount (in human readable format)')
  .action(async source => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config: Config = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      const network = source.network || globalConfig.network
      const chain = source.chain
      const token = source.token
      const amount = Number(source.args[0] || source.amount)
      await staker(network, chain, token, amount, StakerAction.Stake)
      process.exit(0)
    } catch (err) {
      logger.error(err.message)
      process.exit(1)
    }
  })

program
  .command('unstake')
  .description('Unstake amount')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option('-n, --network <string>', 'Network')
  .option('-c, --chain <string>', 'Chain')
  .option('-t, --token <string>', 'Token')
  .option('-a, --amount <number>', 'Amount (in human readable format)')
  .action(async source => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config: Config = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      const network = source.network || globalConfig.network
      const chain = source.chain
      const token = source.token
      const amount = Number(source.args[0] || source.amount)
      await staker(network, chain, token, amount, StakerAction.Unstake)
      process.exit(0)
    } catch (err) {
      logger.error(err.message)
      process.exit(1)
    }
  })

program
  .command('stake-status')
  .description('Stake status')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option('-n, --network <string>', 'Network')
  .option('-c, --chain <string>', 'Chain')
  .option('-t, --token <string>', 'Token')
  .action(async source => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config: Config = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      const network = source.network || globalConfig.network
      const chain = source.chain
      const token = source.token
      await staker(network, chain, token, 0, StakerAction.Status)
      process.exit(0)
    } catch (err) {
      logger.error(err.message)
      process.exit(1)
    }
  })

program
  .command('withdraw')
  .description('Withdraw tokens from wallet')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option('-n, --network <string>', 'Network')
  .option('-c, --chain <string>', 'Chain')
  .option('-t, --token <string>', 'Token')
  .option('-a, --amount <number>', 'Amount (in human readable format)')
  .option('-r, --recipient <string>', 'Recipient to send tokens to')
  .option('--htoken', 'Withdraw hTokens')
  .action(async source => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config: Config = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      const network = source.network || globalConfig.network
      const chain = source.chain
      const token = source.token
      const amount = Number(source.args[0] || source.amount)
      const recipient = source.recipient
      const isHToken = !!source.htoken
      await withdrawTokens(network, chain, token, amount, recipient, isHToken)
      process.exit(0)
    } catch (err) {
      logger.error(err.message)
      process.exit(1)
    }
  })

program
  .command('settle')
  .description('Settle bonded withdrawals')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option('-n, --network <string>', 'Network')
  .option('-c, --chain <string>', 'Chain')
  .option('-t, --token <string>', 'Token')
  .option('--transfer-id <string>', 'Transfer ID')
  .action(async source => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config: Config = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      //dbConfig.path = '/home/mota/.hop-node/db.mainnet'
      const network = source.network
      const chain = source.chain
      const token = source.token
      const transferId = source.transferId

      setConfigByNetwork(network)
      logger.info('network:', network)

      if (!network) {
        throw new Error(
          'network is required. Options are: kovan, goerli, mainnet'
        )
      }
      if (!chain) {
        throw new Error(
          'chain is required. Options are: ethereum, xdai, polygon, optimism, arbitrum'
        )
      }
      if (!token) {
        throw new Error(
          'token is required: Options are: USDC, DAI, etc... Use correct capitalization.'
        )
      }

      /*
      const { stop, watchers } = await startWatchers({
        order: 0,
        tokens: [token],
        networks: ['xdai', 'polygon'],
        enabledWatchers: ['settleBondedWithdrawals'],
        bonder: true,
        challenger: false,
        maxStakeAmounts: {},
        commitTransfersMinThresholdAmounts: 0,
        bondWithdrawalAmounts: 0,
        settleBondedWithdrawalsThresholdPercent: 0,
        dryMode: false
      })

      const watcher = watchers[0].getSiblingWatcherByChainSlug(Chain.xDai)
      const transfers = await db.transfers.getTransfers()
      console.log(transfers)
      const root = await db.transferRoots.getByTransferRootHash('0x7c247a2043b9d4973a139428fe242652d568cecc9fb4c6fd0d4490b16c561c3f')
      console.log('root', root)
      await db.transfers.update(transferId, {
        transferRootId: null,
        transferRootHash: null
      })
      const transfer = await db.transfers.getByTransferId(transferId)
      console.log(transfer)
      await watcher.checkUnsettledTransfer(transfer)
      */

      process.exit(0)
    } catch (err) {
      logger.error(err.message)
      process.exit(1)
    }
  })

program
  .command('xdai-bridge')
  .description('Start the xDai bridge watcher')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .action(async (source: any) => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config: Config = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      const tokens = Object.keys(globalConfig.tokens)
      for (let token of tokens) {
        new xDaiBridgeWatcher({
          token
        }).start()
      }
    } catch (err) {
      logger.error(err.message)
      process.exit(1)
    }
  })

program
  .command('polygon-bridge')
  .description('Start the polygon bridge watcher')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .action(async (source: any) => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config: Config = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      const tokens = Object.keys(globalConfig.tokens)
      for (let token of tokens) {
        new PolygonBridgeWatcher({
          token
        }).start()
      }
    } catch (err) {
      logger.error(err.message)
      process.exit(1)
    }
  })

program
  .command('load-test')
  .option('--concurrent-users <number>', 'Number of concurrent users')
  .option('--iterations <number>', 'Number of iterations')
  .description('Start load test')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option('--env <string>', 'Environment variables file')
  .action(async (source: any) => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config: Config = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      new LoadTest({
        concurrentUsers: Number(source.concurrentUsers || 1),
        iterations: Number(source.iterations || 1)
      }).start()
    } catch (err) {
      logger.error(err.message)
      process.exit(1)
    }
  })

program
  .command('health-check')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option(
    '--bond-withdrawal-time-limit <number>',
    'Number of minutes a transfer should be bonded before alerting'
  )
  .option(
    '--bond-transfer-root-time-limit <number>',
    'Number of minutes a transfer root should be bonded before alerting'
  )
  .option(
    '--commit-transfers-min-threshold-amount <number>',
    'Minimum threshold amount that triggers alert if commit transfers has not occurred'
  )
  .option(
    '--poll-interval-seconds <number>',
    'Number of seconds to wait between each poll'
  )
  .description('Start health check')
  .action(async (source: any) => {
    const configPath = source?.config || source?.parent?.config
    if (configPath) {
      const config: Config = await parseConfigFile(configPath)
      await setGlobalConfigFromConfigFile(config)
    }
    const bondWithdrawalTimeLimitMinutes = Number(
      source.bondWithdrawalTimeLimit
    )
    const bondTransferRootTimeLimitMinutes = Number(
      source.bondTransferRootTimeLimitMinutes
    )
    const commitTransfersMinThresholdAmount = Number(
      source.commitTransfersMinThresholdAmount
    )
    const pollIntervalSeconds = Number(source.pollIntervalSeconds)

    try {
      new HealthCheck({
        bondWithdrawalTimeLimitMinutes,
        bondTransferRootTimeLimitMinutes,
        commitTransfersMinThresholdAmount,
        pollIntervalSeconds
      }).start()
    } catch (err) {
      logger.error(err.message)
      process.exit(1)
    }
  })

program
  .command('challenger')
  .description('Start the challenger watcher')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .action(async (source: any) => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config: Config = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      await startChallengeWatchers()
    } catch (err) {
      logger.error(err.message)
    }
  })

program
  .command('relayer')
  .description('Start the relayer watcher')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .action(async (source: any) => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config: Config = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      await startCommitTransferWatchers()
    } catch (err) {
      logger.error(err.message)
      process.exit(1)
    }
  })

program
  .command('arb-bot')
  .description('Start the arbitrage bot')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option('--max-trade-amount <number>', 'Max trade amount')
  .option('--min-threshold <number>', 'Min threshold')
  .action(async (source: any) => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config: Config = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      const maxTradeAmount = Number(source.maxTradeAmount) || 0
      const minThreshold = Number(source.minThreshold) || 0
      arbbots.start({
        maxTradeAmount,
        minThreshold
      })
    } catch (err) {
      logger.error(err.message)
      process.exit(1)
    }
  })

program
  .command('db-dump')
  .option(
    '--db <string>',
    'Name of db. Options are "transfers", "transfer-roots"'
  )
  .option('--db-path <string>', 'Path to leveldb.')
  .option('--config <string>', 'Config file to use.')
  .description('Dump leveldb database')
  .action(async (source: any) => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config: Config = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      if (source.dbPath) {
        dbConfig.path = source.dbPath
      }
      let dbName = source.db || 'transfers'
      logger.debug(`dumping ${dbName} db located at ${dbConfig.path}`)

      if (dbName === 'transfer-roots') {
        const transferRoots = await db.transferRoots.getTransferRoots()
        console.log(JSON.stringify(transferRoots, null, 2))
      } else {
        const transfers = await db.transfers.getTransfers()
        console.log(JSON.stringify(transfers, null, 2))
      }
    } catch (err) {
      logger.error(err.message)
      process.exit(1)
    }
  })

program
  .command('keystore')
  .description('Keystore')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option('--pass <string>', 'Passphrase to encrypt keystore with.')
  .option('-o, --output <string>', 'Output file path of encrypted keystore.')
  .option('--override', 'Override existing keystore if it exists.')
  .option('--private-key <string>', 'The private key to encrypt.')
  .action(async (source: any) => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config: Config = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      const action = source.args[0]
      let passphrase = source.pass
      const output = source.output || defaultKeystoreFilePath
      if (!action) {
        throw new Error('please specify subcommand')
      }
      if (action === 'generate') {
        if (!passphrase) {
          passphrase = await promptPassphrase(
            'Enter new keystore encryption password'
          )
          const passphraseConfirm = await promptPassphrase('Confirm password')
          if (passphrase !== passphraseConfirm) {
            throw new Error('ERROR: passwords did not match')
          }
        }
        let mnemonic: string
        const hdpath = `m/44'/60'/0'/0/0`
        let privateKey: string | null = source.privateKey || null
        if (!privateKey) {
          const entropy = randomBytes(32)
          mnemonic = entropyToMnemonic(entropy)
          let hdnode = HDNode.fromMnemonic(mnemonic)
          hdnode = hdnode.derivePath(hdpath)
          privateKey = hdnode.privateKey

          clearConsole()
          prompt.start()
          prompt.message = ''
          prompt.delimiter = ''
          await prompt.get({
            properties: {
              blank: {
                message: `
This is your seed phrase. Write it down and store it safely.

${mnemonic}

Press [Enter] when you have written down your mnemonic.`
              }
            }
          } as any)
        }

        clearConsole()
        if (mnemonic) {
          let { mnemonicConfirm } = await prompt.get({
            properties: {
              mnemonicConfirm: {
                message:
                  'Please type mnemonic (separated by spaces) to confirm you have written it down\n\n:'
              }
            }
          } as any)

          clearConsole()
          mnemonicConfirm = (mnemonicConfirm as string).trim()
          if (mnemonicConfirm !== mnemonic) {
            throw new Error('ERROR: mnemonic entered is incorrect')
          }
        }

        const keystore = await generateKeystore(privateKey, passphrase)
        const filepath = path.resolve(output)
        const exists = fs.existsSync(filepath)
        if (exists) {
          const override = !!source.override
          if (!override) {
            throw new Error(
              'ERROR: file exists. Did not override. Use --override flag to override.'
            )
          }
        }
        fs.writeFileSync(filepath, JSON.stringify(keystore), 'utf8')

        await prompt.get({
          properties: {
            blank: {
              message: `
ㅤ${hopArt}
Creating your keys
Creating your keystore
Public address: 0x${keystore.address}
Your keys can be found at: ${filepath}

Keystore generation is complete.
Press [Enter] to exit.
`
            }
          }
        } as any)
        clearConsole()
      } else if (action === 'decrypt') {
        if (!passphrase) {
          passphrase = await promptPassphrase()
        }
        const filepath = source.args[1] || defaultKeystoreFilePath
        if (!filepath) {
          throw new Error('please specify filepath')
        }
        const keystore = JSON.parse(
          fs.readFileSync(path.resolve(filepath), 'utf8')
        )
        const privateKey = await recoverKeystore(keystore, passphrase)
        console.log(privateKey) // intentional log
      } else if (action === 'address') {
        const filepath = source.args[1] || defaultKeystoreFilePath
        if (!filepath) {
          throw new Error('please specify filepath')
        }
        const keystore = JSON.parse(
          fs.readFileSync(path.resolve(filepath), 'utf8')
        )
        const address = keystore.address
        console.log('0x' + address) // intentional log
      } else {
        console.log(`unsupported command: "${action}"`) // intentional log
      }
    } catch (err) {
      logger.error(err.message)
      process.exit(1)
    }
  })

program.parse(process.argv)

function parseArgList (arg: string) {
  return (arg || '')
    .split(',')
    .map((value: string) => value.trim())
    .filter((value: string) => value)
}

function validateKeys (validKeys: string[] = [], keys: string[]) {
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

  if (config['chains']) {
    const validNetworkKeys = [
      Chain.Ethereum,
      Chain.Optimism,
      Chain.Arbitrum,
      Chain.xDai,
      Chain.Polygon
    ]
    const networkKeys = Object.keys(config['chains'])
    await validateKeys(validNetworkKeys, networkKeys)
  }

  if (config['roles']) {
    const validRoleKeys = ['bonder', 'challenger', 'arbBot', 'xdaiBridge']
    const roleKeys = Object.keys(config['roles'])
    await validateKeys(validRoleKeys, roleKeys)
  }

  if (config['watchers']) {
    const watcherKeys = Object.keys(config['watchers'])
    await validateKeys(validWatcherKeys, watcherKeys)
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
    const validKeystoreProps = [
      'location',
      'pass',
      'passwordFile',
      'parameterStore'
    ]
    const keystoreProps = Object.keys(config['keystore'])
    await validateKeys(validKeystoreProps, keystoreProps)
  }

  if (config['commitTransfers']) {
    const validCommitTransfersKeys = ['minThresholdAmount']
    const commitTransfersKeys = Object.keys(config['commitTransfers'])
    await validateKeys(validCommitTransfersKeys, commitTransfersKeys)
  }
}

async function parseConfigFile (_configFile: string = defaultConfigFilePath) {
  let configPath = path.resolve(_configFile.replace('~', os.homedir()))
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

async function promptPassphrase (message: string = 'keystore passphrase') {
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

async function setGlobalConfigFromConfigFile (
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
      let parameterStoreName = config?.keystore?.parameterStore
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
}

process.on('SIGINT', () => {
  process.exit(0)
})

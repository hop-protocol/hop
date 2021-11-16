import OsWatcher from 'src/watchers/OsWatcher'
import arbbots from 'src/arb-bot/bots'
import clearDb from 'src/db/clearDb'
import xDaiBridgeWatcher from 'src/watchers/xDaiBridgeWatcher'
import { Chain } from 'src/constants'
import {
  defaultEnabledNetworks,
  defaultEnabledWatchers,
  gitRev,
  config as globalConfig,
  parseConfigFile,
  setGlobalConfigFromConfigFile,
  setNetworkRpcUrl,
  setNetworkWaitConfirmations,
  slackAuthToken,
  slackChannel,
  slackUsername
} from 'src/config'

import { logger, program } from './shared'
import { printHopArt } from './shared/art'
import {
  startWatchers
} from 'src/watchers/watchers'

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
  .option('--log-db-state', 'Log db state periodically')
  .option('--sync-from-date <string>', 'Date to start syncing db from, in ISO format YYYY-MM-DD')
  .option('--s3-upload', 'Upload available liquidity info as JSON to S3')
  .option('--s3-namespace <string>', 'S3 bucket namespace')
  .option('--heapdump', 'Write heapdump snapshot to a file every 5 minutes')
  .action(async (source: any) => {
    try {
      printHopArt()
      logger.debug('starting hop node')
      logger.debug(`git revision: ${gitRev}`)

      const configFilePath = source.config || source.args[0]
      const config = await parseConfigFile(configFilePath)
      await setGlobalConfigFromConfigFile(config, source.passwordFile)
      const syncFromDate = source.syncFromDate
      const s3Upload = !!source.s3Upload
      const s3Namespace = source.s3Namespace
      if (s3Upload) {
        logger.info('s3 upload enabled')
      }
      if (s3Namespace) {
        logger.info(`s3 namespace: ${s3Namespace}`)
      }

      if (source.clearDb) {
        await clearDb()
        logger.debug(`cleared db at: ${globalConfig.db.path}`)
      }

      const tokens = []
      if (config?.tokens) {
        for (const k in config.tokens) {
          const v = config.tokens[k]
          if (v) {
            tokens.push(k)
          }
        }
      }

      const enabledNetworks: { [key: string]: boolean } = Object.assign(
        {},
        defaultEnabledNetworks
      )
      if (config?.chains) {
        for (const k in config.chains) {
          enabledNetworks[k] = !!config.chains[k]
          const v = config.chains[k]
          if (v instanceof Object) {
            const { rpcUrl, waitConfirmations } = v
            if (rpcUrl) {
              setNetworkRpcUrl(k, rpcUrl)
            }
            if (typeof waitConfirmations === 'number') {
              setNetworkWaitConfirmations(k, waitConfirmations)
            }
          }
        }
      }

      const bonder = config?.roles?.bonder
      const challenger = config?.roles?.challenger
      const order = Number(config?.order ?? 0)
      if (order) {
        logger.info('order:', order)
      }
      let maxStakeAmounts: any
      if (config?.stake) {
        maxStakeAmounts = config.stake
      }
      let commitTransfersMinThresholdAmounts: any = {}
      if (config?.commitTransfers) {
        if (config.commitTransfers?.minThresholdAmount) {
          commitTransfersMinThresholdAmounts =
            config.commitTransfers?.minThresholdAmount
        }
      }
      let settleBondedWithdrawalsThresholdPercent: any = {}
      if (config?.settleBondedWithdrawals) {
        if (config.settleBondedWithdrawals?.thresholdPercent) {
          settleBondedWithdrawalsThresholdPercent =
            config.settleBondedWithdrawals?.thresholdPercent
        }
      }
      const slackEnabled = slackAuthToken && slackChannel && slackUsername
      if (slackEnabled) {
        logger.debug(`slack notifications enabled. channel #${slackChannel}`)
      }
      for (const k in globalConfig.networks) {
        const { waitConfirmations, rpcUrl } = globalConfig.networks[k]
        logger.info(`${k} wait confirmations: ${waitConfirmations || 0}`)
        logger.info(`${k} rpc: ${rpcUrl}`)
      }
      const dryMode = !!source.dry
      if (dryMode) {
        logger.warn('dry mode enabled')
      }
      const enabledWatchers: { [key: string]: boolean } = Object.assign(
        {},
        defaultEnabledWatchers
      )
      if (config?.watchers) {
        for (const key in config.watchers) {
          enabledWatchers[key] = (config.watchers as any)[key]
        }
      }
      const stateUpdateAddress = config?.stateUpdateAddress
      await startWatchers({
        enabledWatchers: Object.keys(enabledWatchers).filter(
          key => enabledWatchers[key]
        ),
        order,
        tokens,
        networks: Object.keys(enabledNetworks).filter(
          key => enabledNetworks[key]
        ),
        bonder,
        challenger,
        maxStakeAmounts,
        commitTransfersMinThresholdAmounts,
        settleBondedWithdrawalsThresholdPercent,
        dryMode,
        stateUpdateAddress,
        syncFromDate,
        s3Upload,
        s3Namespace
      })
      if (config?.roles?.arbBot) {
        const maxTradeAmount = 0
        const minThreshold = 0
        arbbots.start({
          maxTradeAmount,
          minThreshold
        })
      }

      const promises: Array<Promise<void>> = []
      if (config?.roles?.xdaiBridge) {
        for (const token of tokens) {
          promises.push(new xDaiBridgeWatcher({
            chainSlug: Chain.xDai,
            tokenSymbol: token
          }).start())
        }
      }
      promises.push(new Promise((resolve) => {
        new OsWatcher({
          heapdump: source.heapdump
        }).start()
        resolve()
      }))
      await Promise.all(promises)
    } catch (err) {
      logger.error(`hop-node error: ${err.message}\ntrace: ${err.stack}`)
      process.exit(1)
    }
  })

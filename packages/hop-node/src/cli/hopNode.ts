import OsWatcher from 'src/watchers/OsWatcher'
import {
  defaultEnabledNetworks,
  defaultEnabledWatchers,
  gitRev,
  config as globalConfig,
  setNetworkRpcUrl,
  setNetworkWaitConfirmations,
  slackAuthToken,
  slackChannel,
  slackUsername
} from 'src/config'

import { actionHandler, logger, parseBool, parseString, root } from './shared'
import { printHopArt } from './shared/art'
import {
  startWatchers
} from 'src/watchers/watchers'

root
  .description('Start Hop node')
  .option(
    '--dry',
    'Start in dry mode. If enabled, no transactions will be sent.',
    parseBool
  )
  .option(
    '--password-file <path>',
    'File containing password to unlock keystore',
    parseString
  )
  .option('--clear-db', 'Clear cache database on start', parseBool)
  .option('--log-db-state', 'Log db state periodically', parseBool)
  .option('--sync-from-date <string>', 'Date to start syncing db from, in ISO format YYYY-MM-DD', parseString)
  .option('--s3-upload', 'Upload available liquidity info as JSON to S3', parseBool)
  .option('--s3-namespace <name>', 'S3 bucket namespace', parseString)
  .option('--heapdump', 'Write heapdump snapshot to a file every 5 minutes', parseBool)
  .action(actionHandler(main))

async function main (source: any) {
  printHopArt()
  logger.debug('starting hop node')
  logger.debug(`git revision: ${gitRev}`)

  const { config, syncFromDate, s3Upload, s3Namespace, clearDb, heapdump, dry: dryMode } = source

  if (s3Upload) {
    logger.info('s3 upload enabled')
  }
  if (s3Namespace) {
    logger.info(`s3 namespace: ${s3Namespace}`)
  }

  if (clearDb) {
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
    if (!waitConfirmations) {
      throw new Error('waitConfirmations required')
    }
    logger.info(`${k} wait confirmations: ${waitConfirmations}`)
    logger.info(`${k} rpc: ${rpcUrl}`)
  }
  if (dryMode) {
    logger.warn('dry mode enabled')
  }
  const enabledWatchers: { [key: string]: boolean } = Object.assign(
    {},
    defaultEnabledWatchers
  )
  if (config?.watchers) {
    for (const key in config.watchers) {
      enabledWatchers[key] = (config.watchers)[key]
    }
  }
  const stateUpdateAddress = config?.stateUpdateAddress
  const { starts } = await startWatchers({
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
    commitTransfersMinThresholdAmounts,
    settleBondedWithdrawalsThresholdPercent,
    dryMode,
    stateUpdateAddress,
    syncFromDate,
    s3Upload,
    s3Namespace
  })

  if (config?.routes) {
    for (const sourceChain in config?.routes) {
      for (const destinationChain in config.routes[sourceChain]) {
        logger.info(`route: ${sourceChain}→${destinationChain}`)
      }
    }
  }

  const promises: Array<Promise<void>> = []
  promises.push(new Promise((resolve) => {
    new OsWatcher({
      heapdump
    }).start()
    resolve()
  }))
  await Promise.all([...starts, ...promises])
}

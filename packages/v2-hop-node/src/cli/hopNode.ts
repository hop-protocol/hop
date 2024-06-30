import { config as globalConfig } from '#config/index.js'
import { actionHandler, logger, parseBool, parseString, root } from './shared/index.js'
import { utils } from 'ethers'
import { main as enableCCTP } from './cctp/cctp.js'
import { printHopArt } from './shared/art.js'
// import { gitRev } from '#config/index.js'

root
  .description('Start Hop node')
  .option(
    '--dry [boolean]',
    'Start in dry mode. If enabled, no transactions will be sent.',
    parseBool
  )
  .option(
    '--password-file <path>',
    'File containing password to unlock keystore',
    parseString
  )
  .option('--cctp [boolean]', 'Run CCTP', parseBool)
  .action(actionHandler(main))

async function main (source: any) {
  printHopArt()
  logger.debug('starting hop node')
  // TODO: Reintroduce this
  // logger.debug(`git revision: ${gitRev}`)

  const { config, dry: dryMode, cctp: runCCTP } = source

  if (!config) {
    throw new Error('config file is required')
  }

  logger.warn(`dry mode: ${!!dryMode}`)

  const tokens = []
  if (config?.tokens) {
    for (const k in config.tokens) {
      const v = config.tokens[k]
      if (v) {
        tokens.push(k)
      }
    }
  }

  const enabledNetworks: any = {}
  if (config?.chains) {
    for (const k in config.chains) {
      enabledNetworks[k] = !!config.chains[k]
    }
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
  for (const k in globalConfig.networks) {
    if (!Object.keys(enabledNetworks).includes(k)) continue
    const { rpcUrl, redundantRpcUrls, subgraphUrl, customSyncType } = globalConfig.networks[k]
    logger.info(`${k} rpc: ${rpcUrl}`)
    logger.info(`${k} redundantRpcUrls: ${JSON.stringify(redundantRpcUrls)}`)
    if (customSyncType) {
      logger.info(`${k} customSyncType: ${customSyncType}`)
    }
  }

  if (globalConfig.bonderPrivateKey) {
    let privateKey = globalConfig.bonderPrivateKey
    if (!globalConfig.bonderPrivateKey.startsWith('0x')) {
      privateKey = '0x' + privateKey
    }
    const bonderPublicAddress = utils.computeAddress(privateKey)
    logger.info('Bonder public address:', bonderPublicAddress)
  }

  if (runCCTP) {
    return enableCCTP()
  }

  throw new Error('Please specify run type.')
}

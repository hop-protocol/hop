import { actionHandler, logger, parseBool, parseString, root } from './shared/index.js'
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

  logger.warn(`dry mode: ${!!dryMode}`)

  if (runCCTP) {
    return enableCCTP()
  }

  throw new Error('Please specify run type.')
}

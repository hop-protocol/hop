import { actionHandler, logger, parseBool, root } from './shared/index.js'
import { main as enableCCTP } from './cctp/cctp.js'
import { printHopArt } from './shared/art.js'
// import { gitRev } from '#config/index.js'

root
  .description('Start Hop node')
  .option('--cctp [boolean]', 'Run CCTP', parseBool)
  .action(actionHandler(main))

async function main (source: any) {
  printHopArt()
  logger.debug('starting hop node')
  // TODO: Reintroduce this
  // logger.debug(`git revision: ${gitRev}`)

  const { cctp: runCCTP } = source

  if (runCCTP) {
    return enableCCTP()
  }

  throw new Error('Please specify run type.')
}

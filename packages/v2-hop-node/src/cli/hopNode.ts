import { actionHandler, logger, parseBool, root } from './shared/index.js'
import { main as runCCTP } from './cctp/cctp.js'
import { main as runRails } from './rails/rails.js'
import { printHopArt } from './shared/art.js'
// import { gitRev } from '#config/index.js'

root
  .description('Start Hop node')
  .option('--rails [boolean]', 'Run Rails', parseBool)
  .option('--cctp [boolean]', 'Run CCTP', parseBool)
  .action(actionHandler(main))

async function main (source: any) {
  printHopArt()
  logger.debug('starting hop node')
  // TODO: Reintroduce this
  // logger.debug(`git revision: ${gitRev}`)

  const { cctp, rails } = source

  if (!rails && !cctp) {
    throw new Error('Please provide a valid command')
  }

  if (rails && cctp) {
    throw new Error('Please provide only one command')
  }

  if (rails) {
    return runRails()
  }

  if (cctp) {
    return runCCTP()
  }
}

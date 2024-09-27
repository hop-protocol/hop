import { cctpCommand, railsCommand } from './commands/index.js'
import { initCLI } from './shared/shared.js'
import { Command } from 'commander'

// CCTP
import './cctp/cctp.js'
import './cctp/relayCCTP.js'
import './cctp/cctpDBDump.js'
import './cctp/unrelayedCCTPMessages.js'
const program = new Command()

// TODO: Reintroduce GitRev

program
  .name('hop')
  .description('Hop CLI')
  // .version(`Version: ${gitRev}`)
  .hook('preAction', initCLI)
  .addCommand(cctpCommand)
  .addCommand(railsCommand)
  .parse(process.argv)

/**
 * Error Handling
 */

process.on('SIGINT', () => {
  logger.debug('received SIGINT signal. exiting.')
  process.exit(0)
})

process.on('unhandledRejection', (reason: Error, p: Promise<any>) => {
  logger.error('Unhandled rejection: promise:', p, 'reason:', reason)
})

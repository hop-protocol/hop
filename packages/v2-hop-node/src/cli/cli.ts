import { cctpCommand, railsCommand } from './commands/index.js'
import { initCLI } from './utils.js'
import { Command } from 'commander'
import { Logger } from '#logger/index.js'

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
  const logger = new Logger('CLI - SIGINT')
  logger.debug('received SIGINT signal. exiting.')
  process.exit(0)
})

process.on('unhandledRejection', (reason: Error, p: Promise<any>) => {
  const logger = new Logger('CLI - unhandledRejection')
  logger.error('Unhandled rejection: promise:', p, 'reason:', reason)
})

import { cctpProgram, railsProgram } from './commands/index.js'
import { initCLI, parseBool, parseString } from './utils.js'
import { Logger } from '#logger/index.js'
import { Command } from 'commander'

const program = new Command()

// TODO: Reintroduce GitRev

program
  .name('hop')
  .description('Hop CLI')
  // .version(`Version: ${gitRev}`)
  .hook('preAction', initCLI)
  .option('--config <path>', 'Config file path', parseString)
  .option('--dry-run', 'Perform a dry run', parseBool)
  .addCommand(railsProgram)
  .addCommand(cctpProgram)
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
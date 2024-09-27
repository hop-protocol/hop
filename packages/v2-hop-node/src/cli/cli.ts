import { cctpProgram, railsProgram } from './commands/index.js'
import {
  getGitRevision,
  getHelpTextBefore,
  initCLI,
  parseBool,
  parseString
} from './utils.js'
import { HOP_ART } from './constants.js'
import { Logger } from '#logger/index.js'
import { Command } from 'commander'

const program = new Command()

program
  .name('hop')
  .description('Hop CLI')
  .version(getGitRevision())
  .hook('preAction', initCLI)
  .addHelpText('before', getHelpTextBefore(HOP_ART))
  .option('--config <path>', 'Config file path', parseString)
  .option('--dry-run', 'Perform a dry run', parseBool)

program
  .addCommand(railsProgram)
  .addCommand(cctpProgram)

program
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
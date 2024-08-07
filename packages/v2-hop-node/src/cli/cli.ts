import { Logger } from '#logger/index.js'
import { program } from './shared/index.js'

// Main
import './hopNode.js'

// CCTP
import './cctp/cctp.js'
import './cctp/relayCCTP.js'
import './cctp/cctpDBDump.js'
import './cctp/unrelayedCCTPMessages.js'

// TODO: Reintroduce GitRev
// program.version(`Version: ${gitRev ?? 'unknown'}`)
program.version(`Version: ${'unknown'}`)
program.parse(process.argv)

const logger = new Logger('process')
process.on('SIGINT', () => {
  logger.debug('received SIGINT signal. exiting.')
  process.exit(0)
})

process.on('unhandledRejection', (reason: Error, p: Promise<any>) => {
  logger.error('unhandled rejection: promise:', p, 'reason:', reason)
})

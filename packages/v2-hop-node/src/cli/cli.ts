import { Logger } from '#logger/index.js'
import { execSync } from 'node:child_process'
import { program } from './shared/index.js'

import './hopNode.js'

// CCTP
import './cctp/cctp.js'
import './cctp/relayCCTP.js'
import './cctp/cctpDBDump.js'
import './cctp/unrelayedCCTPMessages.js'

const gitRev = process.env.GIT_REV ?? execSync('git rev-parse --short HEAD').toString().trim()
program.version(`Version: ${gitRev ?? 'unknown'}`)
program.parse(process.argv)

const logger = new Logger('process')
process.on('SIGINT', () => {
  logger.debug('received SIGINT signal. exiting.')
  process.exit(0)
})

process.on('unhandledRejection', (reason: Error, p: Promise<any>) => {
  logger.error('unhandled rejection: promise:', p, 'reason:', reason)
})

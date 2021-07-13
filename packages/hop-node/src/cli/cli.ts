import '../moduleAlias'
import Logger from 'src/logger'
import { program } from './shared'

import './arbBot'
import './bonder'
import './challenger'
import './commitTransfers'
import './dbDump'
import './healthCheck'
import './hopNode'
import './keystores'
import './loadTest'
import './polygonBridge'
import './settle'
import './stake'
import './stakeStatus'
import './transferIds'
import './transferRoots'
import './unstake'
import './withdraw'
import './xdaiBridge'

program.parse(process.argv)

const logger = new Logger('process')
process.on('SIGINT', () => {
  logger.debug('received SIGINT signal. exiting.')
  process.exit(0)
})

process.on('unhandledRejection', (reason: Error, p: Promise<any>) => {
  logger.error('unhandled rejection: promise:', p, 'reason:', reason)
})

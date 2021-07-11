import '../moduleAlias'
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
import './unstake'
import './withdraw'
import './xdaiBridge'

program.parse(process.argv)

process.on('SIGINT', () => {
  process.exit(0)
})

process.on('unhandledRejection', (reason: Error, p: Promise<any>) => {
  console.log('unhandled rejection at: promise:', p, 'reason:', reason)
})

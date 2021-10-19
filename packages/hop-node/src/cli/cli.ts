import '../moduleAlias'
import Logger from 'src/logger'
import { program } from './shared'

import './arbBot'
import './bondWithdrawal'
import './bonder'
import './challenger'
import './commitTransfers'
import './contractState'
import './dbDump'
import './exitCommitTx'
import './healthCheck'
import './hopNode'
import './incompleteSettlements'
import './keystores'
import './loadTest'
import './logs'
import './pendingTransfers'
import './polygonBridge'
import './send'
import './settle'
import './showConfig'
import './stake'
import './stakeStatus'
import './swap'
import './transferId'
import './transferIds'
import './transferRoot'
import './transferRoots'
import './transferRootsCount'
import './transfersCount'
import './transfersTable'
import './unbondedTransferRoots'
import './unconfirmedTransferRoots'
import './unstake'
import './updateConfig'
import './withdraw'
import './withdrawalProof'
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

import '../moduleAlias'
import Logger from 'src/logger'
import packageJson from '../../package.json'
import { program } from './shared'

import './arbBot'
import './bondTransferRoot'
import './bondWithdrawal'
import './bondedUnconfirmedRoots'
import './challenger'
import './commitTransfers'
import './confirmRoot'
import './contractState'
import './dbDump'
import './generateChainBalanceArchiveData'
import './healthCheck'
import './hopNode'
import './incompleteSettlements'
import './keystores'
import './logs'
import './pendingTransfers'
import './retryArbTicket'
import './send'
import './settle'
import './showConfig'
import './stake'
import './stakeStatus'
import './swap'
import './totalStake'
import './transferId'
import './transferIds'
import './transferRoot'
import './transferRoots'
import './transferRootsCount'
import './transfersCount'
import './transfersTable'
import './unbondedTransferRoots'
import './unsettledRoots'
import './unstake'
import './unwithdrawnTransfers'
import './updateConfig'
import './vault'
import './verifyChainBalance'
import './verifyCommits'
import './withdraw'
import './withdrawalProof'

program.version(packageJson.version)
program.parse(process.argv)

const logger = new Logger('process')
process.on('SIGINT', () => {
  logger.debug('received SIGINT signal. exiting.')
  process.exit(0)
})

process.on('unhandledRejection', (reason: Error, p: Promise<any>) => {
  logger.error('unhandled rejection: promise:', p, 'reason:', reason)
})

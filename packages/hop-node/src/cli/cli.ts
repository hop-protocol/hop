import '../moduleAlias'
import Logger from 'src/logger'
import { execSync } from 'child_process'
import { program } from './shared'

import './arbBot'
import './bondFirstRootOfRoute'
import './bondTransferRoot'
import './bondWithdrawal'
import './bondedUnconfirmedRoots'
import './challenger'
import './commitTransfers'
import './confirmRoot'
import './dbDump'
import './generateChainBalanceArchiveData'
import './healthCheck'
import './hopNode'
import './incompleteSettlements'
import './invalidBondWithdrawals'
import './keystores'
import './logs'
import './pendingTransfers'
import './relayL1ToL2Message'
import './resyncData'
import './selfTest'
import './send'
import './sendToSelf'
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
import './verifyAwsSigner'
import './verifyChainBalance'
import './verifyCommits'
import './withdraw'
import './withdrawalProof'

// internal metrics
import './metrics/bonderBalance'
import './metrics/bonderTxCost'

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

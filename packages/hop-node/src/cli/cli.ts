import { Logger } from '@hop-protocol/hop-node-core/logger'
import { execSync } from 'node:child_process'
import { program } from './shared/index.js'

import './bondFirstRootOfRoute.js'
import './bondTransferRoot.js'
import './bondWithdrawal.js'
import './bondedUnconfirmedRoots.js'
import './challenger.js'
import './commitTransfers.js'
import './confirmRoot.js'
import './dbDump.js'
import './generateChainBalanceArchiveData.js'
import './healthCheck.js'
import './hopNode.js'
import './incompleteSettlements.js'
import './invalidBondWithdrawals.js'
import './keystores.js'
import './logs.js'
import './pendingTransfers.js'
import './relayL1ToL2Message.js'
import './resyncData.js'
import './selfTest.js'
import './send.js'
import './sendToSelf.js'
import './settle.js'
import './showConfig.js'
import './stake.js'
import './stakeStatus.js'
import './swap.js'
import './totalStake.js'
import './transferId.js'
import './transferIds.js'
import './transferRoot.js'
import './transferRoots.js'
import './transferRootsCount.js'
import './transfersCount.js'
import './transfersTable.js'
import './unbondedTransferRoots.js'
import './unsettledRoots.js'
import './unstake.js'
import './unwithdrawnTransfers.js'
import './updateConfig.js'
import './verifyAwsSigner.js'
import './verifyChainBalance.js'
import './verifyCommits.js'
import './withdraw.js'
import './withdrawalProof.js'

// internal metrics
import './metrics/bonderBalance.js'
import './metrics/bonderTxCost.js'

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

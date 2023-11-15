import L2Bridge from 'src/watchers/classes/L2Bridge'
import { WatcherNotFoundError } from './shared/utils'
import {
  getBondWithdrawalWatcher
} from 'src/watchers/watchers'

import { actionHandler, parseBool, parseNumber, parseString, parseStringArray, root } from './shared'

root
  .command('resync-transfer')
  .description('Resync transfer')
  .option('--chain <slug>', 'Source chain', parseString)
  .option('--token <symbol>', 'Token', parseString)
  .option('--start-block-number <number>', 'Starting block number', parseNumber)
  .option('--end-block-number <number>', ' Ending block number', parseNumber)
  .option('--transfer-ids <id, ...>', 'Comma-separated transfer ids', parseStringArray)
  .option(
    '--dry [boolean]',
    'Start in dry mode. If enabled, no transactions will be sent.',
    parseBool
  )
  .action(actionHandler(main))

async function main (source: any) {
  const {
    chain,
    token,
    startBlockNumber,
    endBlockNumber,
    transferIds
  } = source

  if (!chain) {
    throw new Error('source chain is required in order to apply correct reorg redundant protection')
  }
  if (!token) {
    throw new Error('token is required')
  }
  if (!startBlockNumber) {
    throw new Error('start block number is required')
  }
  if (!endBlockNumber) {
    throw new Error('end block number is required')
  }
  if (startBlockNumber > endBlockNumber) {
    throw new Error('start block number must be less than or equal to end block number')
  }
  if (Math.abs(startBlockNumber - endBlockNumber) > 1000) {
    throw new Error('start block number and end block number must be within 1000 blocks')
  }
  if (!transferIds?.length) {
    throw new Error('transfer ID is required')
  }

  const watcher = await getBondWithdrawalWatcher({ chain, token, dryMode: true })
  if (!watcher) {
    throw new Error(WatcherNotFoundError)
  }

  // TODO: Add L1 -> L2
  // TODO: Add roots (and others)
  const bridge = (watcher.bridge as L2Bridge)
  const events = await bridge.bridgeContract.queryFilter(
    bridge.l2BridgeWriteContract.filters.TransferSent(),
    startBlockNumber,
    endBlockNumber
  )

  for (const event of events) {
    if (transferIds.includes(event.args?.transferId)) {
      await watcher.syncWatcher.handleTransferSentEvent(event)
      await watcher.syncWatcher.populateTransferDbItem(event.args.transferId)
    }
  }
}

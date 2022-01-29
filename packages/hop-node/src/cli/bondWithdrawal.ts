import BondWithdrawalWatcher from 'src/watchers/BondWithdrawalWatcher'
import {
  findWatcher,
  getWatchers
} from 'src/watchers/watchers'

import { actionHandler, parseBool, parseString, root } from './shared'

root
  .command('bond-withdrawal')
  .description('Bond withdrawal')
  .option('--source-chain <slug>', 'Source chain', parseString)
  .option('--token <symbol>', 'Token', parseString)
  .option('--transfer-id <id>', 'Transfer ID', parseString)
  .option(
    '--dry [boolean]',
    'Start in dry mode. If enabled, no transactions will be sent.',
    parseBool
  )
  .action(actionHandler(main))

async function main (source: any) {
  const { sourceChain: chain, token, dry: dryMode, transferId } = source
  if (!chain) {
    throw new Error('chain is required')
  }
  if (!token) {
    throw new Error('token is required')
  }
  if (!transferId) {
    throw new Error('transfer ID is required')
  }

  const watchers = await getWatchers({
    enabledWatchers: ['bondWithdrawal'],
    tokens: [token],
    dryMode
  })

  const watcher = findWatcher(watchers, BondWithdrawalWatcher, chain) as BondWithdrawalWatcher
  if (!watcher) {
    throw new Error('watcher not found')
  }

  const dbTransfer: any = await watcher.db.transfers.getByTransferId(transferId)
  if (!dbTransfer) {
    throw new Error('TransferId does not exist in the DB')
  }
  dbTransfer.attemptSwap = watcher.bridge.shouldAttemptSwap(dbTransfer.amountOutMin, dbTransfer.deadline)
  if (dbTransfer.attemptSwap && dbTransfer.destinationChainId === 1){
    throw new Error('Cannot bond transfer because a swap is being attempted on mainnet. Please withdraw instead.')
  }
  await watcher.sendBondWithdrawalTx(dbTransfer)
}

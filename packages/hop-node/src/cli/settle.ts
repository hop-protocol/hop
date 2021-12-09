import SettleBondedWithdrawalWatcher from 'src/watchers/SettleBondedWithdrawalWatcher'
import { actionHandler, parseBool, parseString, root } from './shared'
import {
  findWatcher,
  getWatchers
} from 'src/watchers/watchers'

root
  .command('settle')
  .description('Settle bonded withdrawals')
  .option('--source-chain <slug>', 'Source chain', parseString)
  .option('--token <slug>', 'Token', parseString)
  .option('--transfer-id <id>', 'Transfer ID', parseString)
  .option(
    '--dry',
    'Start in dry mode. If enabled, no transactions will be sent.',
    parseBool
  )
  .action(actionHandler(main))

async function main (source: any) {
  const { sourceChain: chain, token, transferId, dry: dryMode } = source
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
    enabledWatchers: ['settleBondedWithdrawals'],
    tokens: [token],
    dryMode
  })

  const watcher = findWatcher(watchers, SettleBondedWithdrawalWatcher, chain) as SettleBondedWithdrawalWatcher
  if (!watcher) {
    throw new Error('watcher not found')
  }

  await watcher.checkTransferId(transferId)
}

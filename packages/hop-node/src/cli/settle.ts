import chainIdToSlug from 'src/utils/chainIdToSlug'
import getTransferRoot from 'src/theGraph/getTransferRoot'
import { actionHandler, parseBool, parseString, root } from './shared'
import {
  getSettleBondedWithdrawalsWatcher
} from 'src/watchers/watchers'

root
  .command('settle')
  .description('Settle bonded withdrawals')
  .option('--source-chain <slug>', 'Source chain', parseString)
  .option('--token <slug>', 'Token', parseString)
  .option('--transfer-root-hash <id>', 'Transfer root hash', parseString)
  .option('--transfer-id <id>', 'Transfer ID', parseString)
  .option('--bonder <address>', 'Bonder address', parseString)
  .option('--use-db [boolean]', 'Use the DB to construct the roots', parseBool)
  .option(
    '--dry [boolean]',
    'Start in dry mode. If enabled, no transactions will be sent.',
    parseBool
  )
  .action(actionHandler(main))

async function main (source: any) {
  let { sourceChain: chain, token, transferRootHash, transferId, bonder, useDb, dry: dryMode } = source
  if (!chain) {
    throw new Error('source chain is required')
  }
  if (!token) {
    throw new Error('token is required')
  }
  if (!(transferRootHash || transferId)) {
    throw new Error('transferRootHash or transferId is required')
  }

  if (typeof useDb === 'undefined') {
    useDb = true
  }

  const watcher = await getSettleBondedWithdrawalsWatcher({ chain, token, dryMode })
  if (!watcher) {
    throw new Error('watcher not found')
  }

  if (useDb) {
    if (transferRootHash) {
      await watcher.checkTransferRootHash(transferRootHash, bonder)
    } else {
      await watcher.checkTransferId(transferId)
    }
  } else {
    const transferRoot: any = await getTransferRoot(chain, token, transferRootHash)
    const destinationChainId: number = transferRoot.destinationChainId
    const destinationChain = chainIdToSlug(destinationChainId)
    const transferIds: string[] = []
    for (const transfer of transferRoot.transferIds) {
      transferIds.push(transfer.transferId)
    }

    const destinationChainWatcher = await getSettleBondedWithdrawalsWatcher({ chain: destinationChain, token, dryMode })
    await destinationChainWatcher.bridge.settleBondedWithdrawals(
      bonder,
      transferIds,
      transferRoot.totalAmount
    )
  }
}

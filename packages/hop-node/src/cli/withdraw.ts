import BondWithdrawalWatcher from 'src/watchers/BondWithdrawalWatcher'
import chainIdToSlug from 'src/utils/chainIdToSlug'
import getTransferId from 'src/theGraph/getTransfer'
import getTransferRoot from 'src/theGraph/getTransferRoot'
import { actionHandler, getWithdrawalProofData, parseString, root } from './shared'
import {
  findWatcher,
  getWatchers
} from 'src/watchers/watchers'

root
  .command('withdraw')
  .description('Withdraw a transfer')
  .option('--chain <slug>', 'Chain', parseString)
  .option('--token <symbol>', 'Token', parseString)
  .option('--transfer-id <id>', 'Transfer ID', parseString)
  .action(actionHandler(main))

async function main (source: any) {
  const { chain, token, transferId } = source
  if (!chain) {
    throw new Error('chain is required')
  }
  if (!token) {
    throw new Error('token is required')
  }
  if (!transferId) {
    throw new Error('transfer id is required')
  }

  const transfer = await getTransferId(
    chain,
    token,
    transferId
  )
  if (!transfer) {
    throw new Error('transfer not found')
  }

  const {
    transferRootHash,
    recipient,
    amount,
    transferNonce,
    bonderFee,
    amountOutMin,
    deadline,
    destinationChainId
  } = transfer

  if (!transferRootHash) {
    throw new Error('no transfer root hash found for transfer Id. Has the transferId been committed (pendingTransferIdsForChainId)?')
  }

  if (
    !recipient ||
    !amount ||
    !transferNonce ||
    !bonderFee ||
    !amountOutMin ||
    !deadline ||
    !destinationChainId
  ) {
    throw new Error('transfer Id is incomplete')
  }

  const transferRoot = await getTransferRoot(
    chain,
    token,
    transferRootHash
  )

  if (!transferRoot) {
    throw new Error('no transfer root item found for transfer Id')
  }

  const {
    rootTotalAmount,
    numLeaves,
    proof,
    transferIndex
  } = getWithdrawalProofData(transferId, transferRoot)

  const dryMode = false
  const watchers = await getWatchers({
    enabledWatchers: ['bondWithdrawal'],
    tokens: [token],
    dryMode
  })

  const destinationChain = chainIdToSlug(destinationChainId)
  const watcher = findWatcher(watchers, BondWithdrawalWatcher, destinationChain) as BondWithdrawalWatcher
  if (!watcher) {
    throw new Error('watcher not found')
  }

  await watcher.bridge.withdraw(
    recipient,
    amount,
    transferNonce,
    bonderFee,
    amountOutMin,
    deadline,
    transferRootHash,
    rootTotalAmount,
    transferIndex,
    proof,
    numLeaves
  )
}

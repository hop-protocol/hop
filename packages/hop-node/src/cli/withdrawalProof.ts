import getTransferId from 'src/theGraph/getTransfer'
import getTransferRoot from 'src/theGraph/getTransferRoot'
import { actionHandler, getWithdrawalProofData, parseString, root } from './shared'

root
  .command('withdrawal-proof')
  .description('General withdrawal proof')
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

  const { transferRootHash } = transfer
  if (!transferRootHash) {
    throw new Error('no transfer root hash found for transfer Id. Has the transferId been committed (pendingTransferIdsForChainId)?')
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
    transferIndex,
    leaves
  } = getWithdrawalProofData(transferId, transferRoot)

  const output = {
    transferId,
    transferRootHash,
    leaves,
    proof,
    transferIndex,
    rootTotalAmount,
    numLeaves
  }

  console.log(JSON.stringify(output, null, 2))
}

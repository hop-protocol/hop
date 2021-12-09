import getTransfer from 'src/theGraph/getTransfer'
import getTransferIds from 'src/theGraph/getTransferIds'
import getTransferIdsForTransferRoot from 'src/theGraph/getTransferIdsForTransferRoot'
import { actionHandler, parseBool, parseString, root } from './shared'

root
  .command('transfer-ids')
  .description('Get recent transfer IDs or transfer IDs for transfer root hash')
  .option('--chain <slug>', 'Chain', parseString)
  .option('--token <symbol>', 'Token', parseString)
  .option('--info', 'Show transfer ID info', parseBool)
  .action(actionHandler(main))

async function main (source: any) {
  const { info: showInfo, chain, token, args } = source
  const transferRootHash = args[0]
  if (!chain) {
    throw new Error('chain is required')
  }
  if (!token) {
    throw new Error('token is required')
  }
  if (transferRootHash) {
    const transferIds = await getTransferIdsForTransferRoot(
      chain,
      token,
      transferRootHash
    )
    console.log(JSON.stringify(transferIds.map((x: any) => {
      if (showInfo) {
        return x
      }
      return x.transferId
    }), null, 2))
  } else {
    const transferIds = await getTransferIds(
      chain,
      token
    )
    if (showInfo) {
      for (const { transferId } of transferIds) {
        const transfer = await getTransfer(chain, token, transferId)
        console.log(JSON.stringify(transfer, null, 2))
      }
    } else {
      console.log(JSON.stringify(transferIds.map((x: any) => {
        return x.transferId
      }), null, 2))
    }
  }
}

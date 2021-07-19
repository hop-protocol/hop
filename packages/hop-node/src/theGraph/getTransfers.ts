import getTransfer from './getTransfer'
import getTransferIds from './getTransferIds'

export default async function getTransfers (chain: string, cb: any): Promise<any[]> {
  const transferIds = await getTransferIds(chain)
  const transfers : any[] = []
  for (const x of transferIds) {
    const transfer = await getTransfer(chain, x.transferId)
    transfers.push(transfer)
    cb(transfer)
  }
  return transfers
}

import getTransfer from './getTransfer'
import getTransferIds from './getTransferIds'
import { Filters } from './shared'

export default async function getTransfers (chain: string, cb: any, filters: Partial<Filters> = {}): Promise<any[]> {
  const transferIds = await getTransferIds(chain, filters)
  const transfers : any[] = []
  for (const x of transferIds) {
    const transfer = await getTransfer(chain, x.transferId)
    transfers.push(transfer)
    cb(transfer)
  }
  return transfers
}

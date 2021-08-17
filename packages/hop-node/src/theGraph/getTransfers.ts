import getTransfer from './getTransfer'
import getTransferIds from './getTransferIds'
import { Filters } from './shared'

export default async function getTransfers (chain: string, token: string, cb: any, filters: Partial<Filters> = {}): Promise<any[]> {
  const transferIds = await getTransferIds(chain, token, filters)
  const transfers : any[] = []
  for (const x of transferIds) {
    const transfer = await getTransfer(chain, token, x.transferId)
    transfers.push(transfer)
    cb(transfer)
  }
  return transfers
}

import getTransfer from './getTransfer.js'
import getTransferIds from './getTransferIds.js'
import { Filters } from './shared.js'

export default async function getTransfers (chain: string, token: string, cb: any, filters: Partial<Filters> = {}): Promise<any[]> {
  const transferIds = await getTransferIds(chain, token, filters)
  console.log(`transfer ids count: ${transferIds.length}`)
  const transfers: any[] = []
  for (const x of transferIds) {
    const transfer = await getTransfer(chain, token, x.transferId)
    transfers.push(transfer)
    cb(transfer)
  }
  return transfers
}

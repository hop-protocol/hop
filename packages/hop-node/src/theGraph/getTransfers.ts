import getTransfer from './getTransfer'
import getTransferIds from './getTransferIds'

export default async function getTransfers (chain: string, cb: any): Promise<any[]> {
  const transfers = await getTransferIds(chain)
  const promises = transfers.map(async (x: any) => {
    const transfer = await getTransfer(chain, x.transferId)
    cb(transfer)
    return transfer
  })

  return Promise.all(promises)
}

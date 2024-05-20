import makeRequest from './makeRequest.js'
import { normalizeEntity } from './shared.js'

export default async function getTransferSent (chain: string, transferId: string): Promise<any> {
  const query = `
    query TransferSents($transferId: String) {
      transferSents(
        where: {
          transferId: $transferId
        },
        orderBy: timestamp,
        orderDirection: desc,
        first: 1
      ) {
        id
        transferId
        destinationChainId
        recipient
        amount
        transferNonce
        bonderFee
        index
        amountOutMin
        deadline

        transactionHash
        transactionIndex
        timestamp
        blockNumber
        contractAddress
        token
      }
    }
  `
  const jsonRes = await makeRequest(chain, query, {
    transferId
  })

  const transfer = jsonRes.transferSents?.[0]
  if (!transfer) {
    return
  }

  return normalizeEntity(transfer)
}

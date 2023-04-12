import makeRequest from './makeRequest'
import { normalizeEntity } from './shared'

export async function getTransferIdFromTxHash (transactionHash: string, chain: string) {
  const query = `
    query TransferId($transactionHash: String) {
      transferSents(
        where: {
          transactionHash: $transactionHash
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
    transactionHash
  })

  if (!jsonRes.transferSents) {
    throw new Error('Transfer ID not found')
  }

  const transfer = jsonRes.transferSents[0]
  if (!transfer) {
    return null
  }

  return normalizeEntity(transfer)
}

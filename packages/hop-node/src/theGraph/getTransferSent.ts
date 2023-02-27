import makeRequest from './makeRequest'
import { normalizeEntity } from './shared'

export default async function getTransferSent (chain: string, token: string, transferId: string): Promise<any> {
  let query = `
    query TransferSents(${token ? '$token: String, ' : ''}$transferId: String) {
      transferSents(
        where: {
          ${token ? 'token: $token,' : ''}
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
  let jsonRes = await makeRequest(chain, query, {
    token,
    transferId
  })

  let transfer = jsonRes.transferSents?.[0]
  if (!transfer) {
    return
  }

  return normalizeEntity(transfer)
}

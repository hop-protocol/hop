import getTransferIdsForTransferRoot from './getTransferIdsForTransferRoot'
import getTransferRoot from './getTransferRoot'
import makeRequest from './makeRequest'

export default async function getTransferRootForTransferId (chain: string, token: string, transferId: string): Promise<any> {
  let query = `
    query TransferId($token: String, $transferId: String) {
      transferSents(
        where: {
          token: $token,
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
  const transfer = jsonRes.transferSents?.[0]
  const { timestamp, destinationChainId } = transfer
  query = `
    query TransferCommitted($token: String, $timestamp: String, $destinationChainId: String) {
      transfersCommitteds(
        where: {
          token: $token,
          timestamp_gte: $timestamp,
          destinationChainId: $destinationChainId
        },
        orderBy: timestamp,
        orderDirection: asc,
        first: 10
      ) {
        id
        rootHash
        destinationChainId
        totalAmount
        rootCommittedAt

        transactionHash
        transactionIndex
        timestamp
        blockNumber
        contractAddress
        token
      }
    }
  `
  jsonRes = await makeRequest(chain, query, {
    token,
    timestamp,
    destinationChainId
  })

  const transferRoots = jsonRes.transfersCommitteds
  transfer.transferRootHash = undefined
  transfer.transferRoot = undefined
  for (const transferRoot of transferRoots) {
    const transferIds = await getTransferIdsForTransferRoot(chain, token, transferRoot.rootHash)
    const exists = transferIds.find((x: any) => x.transferId === transferId)
    if (exists) {
      // get complete object
      return getTransferRoot(chain, token, transferRoot.rootHash)
    }
  }
}

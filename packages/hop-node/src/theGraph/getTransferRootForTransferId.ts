import getTransferIdsForTransferRoot from './getTransferIdsForTransferRoot'
import getTransferRoot from './getTransferRoot'
import makeRequest from './makeRequest'

export default async function getTransferRootForTransferId (chain: string, transferId: string): Promise<any> {
  let query = `
    query TransferId($transferId: String) {
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
        timestamp
        transactionHash
        blockNumber
      }
    }
  `
  let jsonRes = await makeRequest(chain, query, {
    transferId
  })
  const transfer = jsonRes.transferSents?.[0]
  const { timestamp, destinationChainId } = transfer
  query = `
    query TransferCommitted($timestamp: String, $destinationChainId: String) {
      transfersCommitteds(
        where: {
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
        timestamp
        transactionHash
        blockNumber
      }
    }
  `
  jsonRes = await makeRequest(chain, query, {
    timestamp,
    destinationChainId
  })

  const transferRoots = jsonRes.transfersCommitteds
  transfer.transferRootHash = undefined
  transfer.transferRoot = undefined
  for (const transferRoot of transferRoots) {
    const transferIds = await getTransferIdsForTransferRoot(chain, transferRoot.rootHash)
    const exists = transferIds.find((x: any) => x.transferId === transferId)
    if (exists) {
      // get complete object
      return getTransferRoot(chain, transferRoot.rootHash)
    }
  }
}

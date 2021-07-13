import makeRequest from './makeRequest'

export default async function getTransferRoots (chain: string): Promise<string[]> {
  const query = `
    query TransferRoots {
      transfersCommitteds(
        orderBy: timestamp,
        orderDirection: desc,
        first: 1000
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
  const jsonRes = await makeRequest(chain, query)
  return jsonRes.transfersCommitteds.map((x: any) => {
    x.destinationChainId = Number(x.destinationChainId)
    x.timestamp = Number(x.timestamp)
    x.blockNumber = Number(x.blockNumber)
    return x
  })
}

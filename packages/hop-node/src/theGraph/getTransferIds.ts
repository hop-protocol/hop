import makeRequest from './makeRequest'

export default async function getTransferIds (
  chain: string
): Promise<string[]> {
  const query = `
    query TransfersSent {
      transferSents(
        orderBy: blockNumber,
        orderDirection: desc,
        first: 1000,
      ) {
        id
        transferId
        destinationChainId
        transactionHash
        index
        timestamp
        blockNumber
      }
    }
  `
  const jsonRes = await makeRequest(chain, query)

  // normalize fields
  const transferIds = jsonRes.transferSents.map((x: any) => {
    x.destinationChainId = Number(x.destinationChainId)
    x.index = Number(x.index)
    x.blockNumber = Number(x.blockNumber)
    x.timestamp = Number(x.timestamp)
    return x
  })

  return transferIds
}

import makeRequest from './makeRequest'
import { Chain } from 'src/constants'
import { normalizeEntity } from './shared'

export default async function getTransferSents (chain: string) {
  const queryL1 = `
    query TransferSentToL2 {
      transferSents: transferSentToL2S(
        orderBy: timestamp,
        orderDirection: desc
      ) {
        id
        destinationChainId
        amount
        transactionHash
        timestamp
      }
    }
  `
  const queryL2 = `
    query TransferSents {
      transferSents(
        orderBy: timestamp,
        orderDirection: desc
      ) {
        transferId
        destinationChainId
        amount
        transactionHash
        timestamp
      }
    }
  `
  let query = queryL1
  if (chain !== Chain.Ethereum) {
    query = queryL2
  }
  const jsonRes = await makeRequest(chain, query)
  return jsonRes.transferSents.map((x: any) => normalizeEntity(x))
}

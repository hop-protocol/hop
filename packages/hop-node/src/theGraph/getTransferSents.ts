import makeRequest from './makeRequest'
import { Chain } from 'src/constants'
import { normalizeEntity } from './shared'

export default async function getTransferSents (chain: string, token: string) {
  const queryL1 = `
    query TransferSentToL2($token: String) {
      transferSents: transferSentToL2S(
        where: {
          token: $token
        },
        orderBy: timestamp,
        orderDirection: desc
      ) {
        id
        destinationChainId
        amount
        transactionHash
        timestamp
        token
      }
    }
  `
  const queryL2 = `
    query TransferSents($token: String) {
      transferSents(
        where: {
          token: $token
        },
        orderBy: timestamp,
        orderDirection: desc
      ) {
        transferId
        destinationChainId
        amount
        transactionHash
        timestamp
        token
      }
    }
  `
  let query = queryL1
  if (chain !== Chain.Ethereum) {
    query = queryL2
  }
  const jsonRes = await makeRequest(chain, query, {
    token
  })
  return jsonRes.transferSents.map((x: any) => normalizeEntity(x))
}

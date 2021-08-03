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
        orderDirection: desc,
        first: 1000
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
  const queryL2 = `
    query TransferSents($token: String) {
      transferSents(
        where: {
          token: $token
        },
        orderBy: timestamp,
        orderDirection: desc
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
  let query = queryL1
  if (chain !== Chain.Ethereum) {
    query = queryL2
  }
  const jsonRes = await makeRequest(chain, query, {
    token
  })
  return jsonRes.transferSents.map((x: any) => normalizeEntity(x))
}

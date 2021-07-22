import getBondedWithdrawal from './getBondedWithdrawal'
import getTransferRootForTransferId from './getTransferRootForTransferId'
import makeRequest from './makeRequest'
import { chainIdToSlug, normalizeEntity } from './shared'

export default async function getTransfer (chain: string, token: string, transferId: string): Promise<any> {
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

  let transfer = jsonRes.transferSents?.[0]
  if (!transfer) {
    return
  }
  transfer.sourceChain = chain
  transfer = normalizeEntity(transfer)

  const destinationChain = chainIdToSlug[transfer.destinationChainId]
  const bondedWithdrawal = await getBondedWithdrawal(destinationChain, token, transferId)
  transfer.bondedWithdrawalEvent = bondedWithdrawal
  transfer.bonded = !!bondedWithdrawal

  const transferRoot = await getTransferRootForTransferId(chain, token, transferId)
  transfer.committed = !!transferRoot
  transfer.transferRoot = transferRoot
  transfer.transferRootHash = transferRoot?.rootHash

  transfer.settled = false
  if (bondedWithdrawal && transferRoot) {
    query = `
      query Settled($token: String, $timestamp: String, $transferRootHash: String) {
        multipleWithdrawalsSettleds(
          where: {
            token: $token,
            timestamp_gte: $timestamp,
            rootHash: $transferRootHash
          },
          orderBy: timestamp,
          orderDirection: desc,
          first: 1
        ) {
          id
          bonder
          totalBondsSettled
          rootHash

          transactionHash
          transactionIndex
          timestamp
          blockNumber
          contractAddress
          token
        }
      }
    `
    jsonRes = await makeRequest(destinationChain, query, {
      token,
      timestamp: bondedWithdrawal.timestamp.toString(),
      transferRootHash: transferRoot.rootHash
    })
    const bondedWithdrawalSettled = normalizeEntity(jsonRes.multipleWithdrawalsSettleds?.[0])
    transfer.settled = !!bondedWithdrawalSettled
    transfer.bondedWithdrawalSettledEvent = bondedWithdrawalSettled
  }

  return transfer
}

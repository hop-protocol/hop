import getBondedWithdrawal from './getBondedWithdrawal.js'
import { getRpcProvider } from '@hop-protocol/hop-node-core/utils'
import getTransferRootForTransferId from './getTransferRootForTransferId.js'
import makeRequest from './makeRequest.js'
import { chainIdToSlug, normalizeEntity } from './shared.js'

export default async function getTransfer (chain: string, token: string, transferId: string): Promise<any> {
  let query = `
    query TransferId(${token ? '$token: String, ' : ''}$transferId: String) {
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

  token = transfer.token

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
          first: 1000
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

    const provider = getRpcProvider(destinationChain)
    if (!provider) {
      throw new Error(`provider for ${chain} not found. Check network is correct`)
    }

    let bondedWithdrawalFrom = ''
    if (bondedWithdrawal) {
      const bondWithdrawalTx = await provider.getTransaction(bondedWithdrawal.transactionHash)
      bondedWithdrawalFrom = bondWithdrawalTx?.from?.toLowerCase()
    }
    if (bondedWithdrawalFrom) {
      const settledEvents = jsonRes.multipleWithdrawalsSettleds ?? []
      for (const settledEvent of settledEvents) {
        const bondedWithdrawalSettled = normalizeEntity(settledEvent)
        const settleFrom = bondedWithdrawalSettled.bonder?.toLowerCase()
        if (bondedWithdrawalFrom && settleFrom && bondedWithdrawalFrom === settleFrom) {
          transfer.settled = true
          transfer.bondedWithdrawalSettledEvent = bondedWithdrawalSettled
          break
        }
      }
    }
  }

  return transfer
}

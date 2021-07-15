import getBondedWithdrawal from './getBondedWithdrawal'
import getTransferRootForTransferId from './getTransferRootForTransferId'
import makeRequest from './makeRequest'

const chainsToSlug: any = {
  1: 'ethereum',
  100: 'xdai',
  137: 'polygon'
}

function normalizeTransfer (x: any) {
  if (!x) {
    return x
  }
  x.destinationChainId = Number(x.destinationChainId)
  x.timestamp = Number(x.timestamp)
  x.blockNumber = Number(x.blockNumber)
  return x
}

export default async function getTransfer (chain: string, transferId: string): Promise<any> {
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

  let transfer = jsonRes.transferSents?.[0]
  if (!transfer) {
    return
  }
  transfer = normalizeTransfer(transfer)

  const destinationChain = chainsToSlug[transfer.destinationChainId]
  const bondedWithdrawal = await getBondedWithdrawal(destinationChain, transferId)
  transfer.bondedWithdrawal = bondedWithdrawal
  transfer.bonded = !!bondedWithdrawal

  const transferRoot = await getTransferRootForTransferId(chain, transferId)
  transfer.committed = !!transferRoot
  transfer.transferRoot = transferRoot
  transfer.transferRootHash = transferRoot?.rootHash

  transfer.settled = false
  if (bondedWithdrawal && transferRoot) {
    query = `
      query Settled($timestamp: String, $transferRootHash: String) {
        multipleWithdrawalsSettleds(
          where: {
            timestamp_gte: $timestamp,
            rootHash: $transferRootHash
          },
          orderBy: timestamp,
          orderDirection: desc,
          first: 1
        ) {
          id
          rootHash
          timestamp
          transactionHash
          blockNumber
        }
      }
    `
    jsonRes = await makeRequest(destinationChain, query, {
      timestamp: bondedWithdrawal.timestamp.toString(),
      transferRootHash: transferRoot.rootHash
    })
    const bondedWithdrawalSettled = jsonRes.multipleWithdrawalsSettleds?.[0]
    transfer.settled = !!bondedWithdrawalSettled
    transfer.bondedWithdrawalSettled = bondedWithdrawalSettled
  }

  return transfer
}

import makeRequest from './makeRequest'

async function getBonds (chain: string, startDate: number, endDate: number) {
  const query = `
    query WithdrawalBonded($startDate: Int, $endDate: Int) {
      withdrawalBondeds(
        where: {
          timestamp_gte: $startDate,
          timestamp_lte: $endDate
        },
        orderBy: id,
        orderDirection: asc,
        first: 1000
      ) {
        id
        transferId
        amount

        transactionHash
        transactionIndex
        timestamp
        blockNumber
        contractAddress
        token
      }
    }
  `

  const variables = {
    startDate,
    endDate
  }

  const jsonRes = await makeRequest(chain, query, variables)
  return jsonRes.withdrawalBondeds
}

async function getTransfers (chain: string, transferIds: string[]) {
  if (chain === 'ethereum') {
    return []
  }
  const query = `
    query TransferSents($transferIds: [String]) {
      transferSents: transferSents(
        where: {
          transferId_in: $transferIds
        },
        first: 1000,
        orderBy: id,
        orderDirection: asc
      ) {
        id
        transferId
        destinationChainId
        amount
        amountOutMin
        bonderFee
        recipient
        deadline
        transactionHash
        timestamp
        token
        from
      }
    }
  `

  const variables = {
    transferIds
  }

  const jsonRes = await makeRequest(chain, query, variables)
  return jsonRes.transferSents
}

export async function getInvalidBondWithdrawals (startDate: number, endDate: number) {
  const chains = ['ethereum', 'polygon', 'gnosis', 'arbitrum', 'optimism']
  const bonds: Record<string, any> = {}
  const transfers: Record<string, any> = {}
  for (const chain of chains) {
    const items = await getBonds(chain, startDate, endDate)
    for (const item of items) {
      bonds[item.transferId] = item
      bonds[item.transferId].destinationChain = chain
    }
  }
  const bondTransferIds = Object.values(bonds).map((x: any) => x.transferId)
  for (const chain of chains) {
    const items = await getTransfers(chain, bondTransferIds)
    for (const item of items) {
      transfers[item.transferId] = item
    }
  }
  const invalidBonds: Record<string, any> = []
  for (const bondTransferId in bonds) {
    if (!transfers[bondTransferId]) {
      invalidBonds[bondTransferId] = transfers[bondTransferId]
    }
  }
  return Object.values(invalidBonds)
}

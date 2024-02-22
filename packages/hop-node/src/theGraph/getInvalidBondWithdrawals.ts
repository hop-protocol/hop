import makeRequest from './makeRequest.js'
import _ from 'lodash'

async function getBonds (chain: string, startDate: number, endDate: number, lastId: string = '0') {
  const query = `
    query WithdrawalBonded($startDate: Int, $endDate: Int, $lastId: ID) {
      withdrawalBondeds(
        where: {
          timestamp_gte: $startDate,
          timestamp_lte: $endDate,
          id_gt: $lastId
        },
        first: 1000,
        orderBy: id,
        orderDirection: asc
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
        from
      }
    }
  `

  const variables = {
    startDate,
    endDate,
    lastId
  }

  const jsonRes = await makeRequest(chain, query, variables)
  let items = jsonRes.withdrawalBondeds

  const maxItemsLength = 1000
  if (items.length === maxItemsLength) {
    lastId = items[items.length - 1].id
    console.log('getBonds lastId', lastId, chain)
    items = items.concat(await getBonds(
      chain,
      startDate,
      endDate,
      lastId
    ))
  }

  return items
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

  let items: any = []
  const chunkSize = 1000
  const allChunks = _.chunk(transferIds, chunkSize)
  let i = 0
  for (const _transferIds of allChunks) {
    i++
    console.log('getTransfers', chain, i, allChunks.length)
    const data = await makeRequest(chain, query, {
      transferIds: _transferIds
    })

    items = items.concat(data.transferSents || [])
  }

  return items.filter((x: any) => x)
}

export async function getInvalidBondWithdrawals (startDate: number, endDate: number) {
  const chains = ['ethereum', 'polygon', 'gnosis', 'arbitrum', 'optimism', 'nova', 'base', 'linea', 'polygonzk']
  const bonds: Record<string, any> = {}
  const transfers: Record<string, any> = {}
  for (const chain of chains) {
    console.log('fetching bonds', chain, startDate, endDate)
    const items = await getBonds(chain, startDate, endDate)
    for (const item of items) {
      bonds[item.transferId] = item
      bonds[item.transferId].destinationChain = chain
    }
  }
  const bondTransferIds = Object.values(bonds).map((x: any) => x.transferId)
  for (const chain of chains) {
    console.log('fetching transfers', chain, bondTransferIds.length)
    const items = await getTransfers(chain, bondTransferIds)
    for (const item of items) {
      transfers[item.transferId] = item
    }
  }
  const invalidBonds: Record<string, any> = []
  for (const bondTransferId in bonds) {
    if (!transfers[bondTransferId]) {
      invalidBonds[bondTransferId] = bonds[bondTransferId]
    }
  }
  return Object.values(invalidBonds)
}

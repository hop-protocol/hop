import makeRequest from './makeRequest.js'
import { normalizeEntity } from './shared.js'

async function getTransfers (chain: string, token: string, filters: any) {
  const { account } = filters
  const query = `
    query TransfersSent($token: String!, $account: String!) {
      transferSents(
        where: {
          token: $token,
          from: $account
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
        from
      }
    }
  `
  const variables = {
    token,
    account: account.toLowerCase()
  }

  const jsonRes = await makeRequest(chain, query, variables)
  const transfers = jsonRes.transferSents.map((x: any) => normalizeEntity(x))
  return transfers
}

async function getWithdrawalBondeds (network: string, chain: string, transferIds: string[]) {
  const query = `
    query WithdrawalBondeds($transferIds: [String]) {
      withdrawalBondeds: withdrawalBondeds(
        where: {
          transferId_in: $transferIds
        },
        first: 1000,
        orderBy: id,
        orderDirection: asc
      ) {
        id
        transferId
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
  const withdrawalBondeds = jsonRes.withdrawalBondeds.map((x: any) => normalizeEntity(x))
  return withdrawalBondeds
}

async function getWithdrawals (network: string, chain: string, transferIds: string[]) {
  const query = `
    query Withdrews($transferIds: [String]) {
      withdrews: withdrews(
        where: {
          transferId_in: $transferIds
        },
        first: 1000,
        orderBy: id,
        orderDirection: asc
      ) {
        id
        transferId
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
  const withdrews = jsonRes.withdrews.map((x: any) => normalizeEntity(x))
  return withdrews
}

export async function getUnwithdrawnTransfers (network: string, chain: string, destinationChain: string, token: string, filters: any): Promise<any[]> {
  const transfers = await getTransfers(chain, token, filters)

  const transferIds = transfers.map((x: any) => x.transferId)
  const withdrawalBondeds = await getWithdrawalBondeds(network, destinationChain, transferIds)
  const withdrawals = await getWithdrawals(network, destinationChain, transferIds)

  const unbonded: any = {}
  for (const transfer of transfers) {
    unbonded[transfer.transferId] = transfer
  }

  for (const bond of withdrawalBondeds) {
    delete unbonded[bond.transferId]
  }

  for (const withdraw of withdrawals) {
    delete unbonded[withdraw.transferId]
  }

  return Object.values(unbonded)
}

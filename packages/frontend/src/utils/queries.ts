import { utils } from '@hop-protocol/sdk'
import { BigNumberish } from 'ethers'
import logger from 'src/logger'
import { reactAppNetwork } from 'src/config'

async function queryFetch(url: string, query: string, variables?: any) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: variables || {},
      }),
    })
    const jsonRes = await res.json()
    return jsonRes.data
  } catch (error) {
    logger.error(error)
    throw error
  }
}

export interface L2Transfer {
  token: string
  amount: string
  timestamp: string
  deadline: string
  transferId: string
  destinationChainId: string
  transactionHash: string
}

export interface L1Transfer {
  timestamp: string
  token: string
  transactionHash: string
}

export function normalizeBN(str: BigNumberish) {
  if (typeof str === 'string') {
    return str
  }

  return str.toString()
}

export async function fetchTransferSents(
  chain: string,
  recipient: string,
  txHash: string
): Promise<L2Transfer[]> {
  recipient = recipient.toLowerCase()
  txHash = txHash.toLowerCase()

  const query = `
    {
      transferSents(
        where: {
          recipient: "${recipient}",
          transactionHash: "${txHash}",
        }
      ) {
        amount
        amountOutMin
        blockNumber
        bonderFee
        deadline
        destinationChainId
        index
        token
        timestamp
        transferId
        transferNonce
        transactionHash
      }
    }
  `

  const url = utils.getSubgraphUrl(reactAppNetwork, chain)
  const data = await queryFetch(url, query)

  return data?.transferSents
}

export async function fetchTransferFromL1Completeds(
  chain: string,
  recipient: string,
  amount: BigNumberish,
  deadline: BigNumberish
): Promise<L1Transfer[]> {
  recipient = recipient.toLowerCase()
  amount = normalizeBN(amount)
  deadline = normalizeBN(deadline)
  const query = `
    {
      transferFromL1Completeds(
        where: {
          recipient: "${recipient}",
          amount: "${amount}",
          deadline: "${deadline}"
        }
      ) {
        transactionHash
        timestamp
        token
      }
    }
  `

  const url = utils.getSubgraphUrl(reactAppNetwork, chain)
  const data = await queryFetch(url, query)

  return data?.transferFromL1Completeds
}

export async function fetchWithdrawalBondedsByTransferId(chain: string, transferId: BigNumberish) {
  transferId = normalizeBN(transferId)

  const query = `
      query WithdrawalBondeds {
        withdrawalBondeds(
          where: {
            transferId: "${transferId}"
          }
        ) {
          transactionHash
          timestamp
          token
        }
      }
    `
  const url = utils.getSubgraphUrl(reactAppNetwork, chain)
  const data = await queryFetch(url, query)
  return data?.withdrawalBondeds
}

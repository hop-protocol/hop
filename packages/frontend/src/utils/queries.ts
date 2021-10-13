import logger from 'src/logger'

export function getUrl(chain) {
  return `https://api.thegraph.com/subgraphs/name/hop-protocol/hop-${chain}`
}

async function queryFetch(url, query, variables?: any) {
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

export interface L1Transfer {
  timestamp: string
  token: string
  transactionHash: string
}

export async function fetchTransferFromL1Completeds(
  chain,
  recipient: string,
  amount: string
): Promise<L1Transfer[]> {
  const query = `
    {
      transferFromL1Completeds(
        where: {
          recipient: "${recipient}",
          amount: "${amount}"
        }
      ) {
        timestamp
        token
        transactionHash
      }
    }
  `

  const url = getUrl(chain)
  const data = await queryFetch(url, query)

  return data?.transferFromL1Completeds
}

export async function fetchWithdrawalBondedsByTransferId(chain, transferId: string) {
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
  const url = getUrl(chain)
  const data = await queryFetch(url, query)
  return data.withdrawalBondeds
}


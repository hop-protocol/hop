import chainSlugToId from 'src/utils/chainSlugToId'
import makeRequest from './makeRequest'
import { DateTime } from 'luxon'

export default async function getUnconfirmedCommits (chain: string, token: string, destinationChain: string): Promise<any> {
  const destinationChainId: number = chainSlugToId(destinationChain)

  let query = getTransfersCommittedsQuery(token)
  const transfersCommittedRes = await makeRequest(chain, query, {
    token,
    destinationChainId: destinationChainId.toString()
  })
  const transfersCommitted = transfersCommittedRes.transfersCommitteds
  if (!transfersCommitted) {
    throw new Error('There are no committed transfers')
  }

  for (let i = 0; i < transfersCommitted.length; i++) {
    const { rootHash, totalAmount, timestamp } = transfersCommitted[i]

    // All confirmations happen on ethereum
    const requestChain = 'ethereum'
    query = getTransferRootConfirmedQuery()
    const transferRootConfirmedRes = await makeRequest(requestChain, query, {
      rootHash
    })
    const transferRootConfirmed = transferRootConfirmedRes.transferRootConfirmeds
    if (transferRootConfirmed.length === 0) {
      const formattedTimestamp = DateTime.fromMillis(Number(timestamp) * 1000)
      console.log(`No confirmation for ${rootHash} committed at ${formattedTimestamp} with an amount of ${totalAmount}`)
      continue
    }
  }
}

function getTransfersCommittedsQuery (token: string) {
  const query = `
    query TransferId(${token ? '$token: String, ' : ''}$destinationChainId: String) {
      transfersCommitteds(
        where: {
          ${token ? 'token: $token,' : ''}
          destinationChainId: $destinationChainId
        },
        orderBy: timestamp,
        orderDirection: desc,
        first: 1000
      ) {
        rootHash
        totalAmount
        timestamp
      }
    }
  `

  return query
}

function getTransferRootConfirmedQuery () {
  const query = `
    query Confirmed($rootHash: String) {
      transferRootConfirmeds(
        where: {
          rootHash: $rootHash
        }
      ) {
        totalAmount
      }
    }
  `

  return query
}

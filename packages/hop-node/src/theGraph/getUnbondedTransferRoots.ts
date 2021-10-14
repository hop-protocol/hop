import chainSlugToId from 'src/utils/chainSlugToId'
import makeRequest from './makeRequest'
import { DateTime } from 'luxon'

export default async function getUnbondedTransferRoots (chain: string, token: string, destinationChain: string): Promise<any> {
  const destinationChainId: number = chainSlugToId(destinationChain)! // eslint-disable-line

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

    query = getTransferRootBondedsQuery()
    const requestChain = 'ethereum'
    const transferRootBondedRes = await makeRequest(requestChain, query, {
      rootHash
    })
    const transferRootBonded = transferRootBondedRes.transferRootBondeds
    if (transferRootBonded.length === 0) {
      const formattedTimestamp = DateTime.fromMillis(Number(timestamp) * 1000)
      console.log(`No bond for ${rootHash} committed at ${formattedTimestamp} with an amount of ${totalAmount}`)
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

function getTransferRootBondedsQuery () {
  const query = `
    query Bonded($rootHash: String) {
      transferRootBondeds(
        where: {
          root: $rootHash
        }
      ) {
        timestamp
      }
    }
  `

  return query
}

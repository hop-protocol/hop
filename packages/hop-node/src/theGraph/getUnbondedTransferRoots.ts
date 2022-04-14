import chainSlugToId from 'src/utils/chainSlugToId'
import getTokenDecimals from 'src/utils/getTokenDecimals'
import makeRequest from './makeRequest'
import { DateTime } from 'luxon'
import { formatUnits } from 'ethers/lib/utils'

export default async function getUnbondedTransferRoots (chain: string, token: string, destinationChain: string, startTime?: number, endTime?: number): Promise<any> {
  const destinationChainId: number = chainSlugToId(destinationChain)

  let query = getTransfersCommittedsQuery(token, startTime, endTime)
  const transfersCommittedRes = await makeRequest(chain, query, {
    token,
    destinationChainId: destinationChainId.toString(),
    startTime: startTime?.toString(),
    endTime: endTime?.toString()
  })
  const transfersCommitted = transfersCommittedRes.transfersCommitteds
  if (!transfersCommitted) {
    throw new Error('There are no committed transfers')
  }

  const result: any = []

  for (let i = 0; i < transfersCommitted.length; i++) {
    let { rootHash, totalAmount, timestamp } = transfersCommitted[i]
    timestamp = Number(timestamp)

    query = getTransferRootBondedsQuery()
    const requestChain = 'ethereum'
    const transferRootBondedRes = await makeRequest(requestChain, query, {
      rootHash
    })
    const transferRootBonded = transferRootBondedRes.transferRootBondeds
    if (transferRootBonded.length === 0) {
      const formattedTimestamp = DateTime.fromSeconds(timestamp)
      console.log(`No bond for ${rootHash} committed at ${formattedTimestamp} with an amount of ${totalAmount}`)
      const decimals = getTokenDecimals(token)
      const totalAmountFormatted = Number(formatUnits(totalAmount, decimals))
      result.push({
        sourceChain: chain,
        destinationChain,
        transferRootHash: rootHash,
        totalAmountFormatted,
        totalAmount,
        token,
        timestamp
      })
      continue
    }
  }

  return result
}

function getTransfersCommittedsQuery (token: string, startTime?: number, endTime?: number) {
  const query = `
    query TransferId(${token ? '$token: String, ' : ''}${startTime ? '$startTime: String, ' : ''}${endTime ? '$endTime: String,' : ''}$destinationChainId: String) {
      transfersCommitteds(
        where: {
          ${token ? 'token: $token,' : ''}
          ${startTime ? 'timestamp_gt: $startTime,' : ''}
          ${endTime ? 'timestamp_lt: $endTime,' : ''}
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

import makeRequest from './makeRequest.js'
import { MaxInt32 } from '#constants/index.js'
import { normalizeEntity } from './shared.js'

export default async function getTransferRootConfirmed (
  chain: string,
  token: string,
  startDate: number = 0,
  endDate: number = MaxInt32,
  lastId: string = '0'
) {
  const query = `
    query TransferRootConfirmed(${token ? '$token: String, ' : ''}$startDate: Int, $endDate: Int, $lastId: ID) {
      transferRootConfirmeds(
        where: {
          ${token ? 'token: $token,' : ''}
          timestamp_gte: $startDate
          timestamp_lte: $endDate
          id_gt: $lastId
        },
        orderBy: id,
        orderDirection: asc,
        first: 1000
      ) {
        id
        rootHash
        transactionHash
        totalAmount
        destinationChainId
        timestamp
      }
    }
  `
  const jsonRes = await makeRequest(chain, query, {
    token,
    startDate,
    endDate,
    lastId
  })
  let transferRoots = jsonRes.transferRootConfirmeds.map((x: any) => normalizeEntity(x))

  const maxItemsLength = 1000
  if (transferRoots.length === maxItemsLength) {
    lastId = transferRoots[transferRoots.length - 1].id
    transferRoots = transferRoots.concat(await getTransferRootConfirmed(
      chain,
      token,
      startDate,
      endDate,
      lastId
    ))
  }

  return transferRoots
}

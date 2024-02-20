import makeRequest from './makeRequest.js'
import { MaxInt32 } from 'src/constants/index.js'
import { normalizeEntity } from './shared.js'

export default async function getTransferRootSet (
  chain: string,
  token: string,
  startDate: number = 0,
  endDate: number = MaxInt32,
  lastId: string = '0'
) {
  const query = `
    query TransferRootSet(${token ? '$token: String, ' : ''}$startDate: Int, $endDate: Int, $lastId: ID) {
      transferRootSets(
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
        totalAmount
      }
    }
  `
  const jsonRes = await makeRequest(chain, query, {
    token,
    startDate,
    endDate,
    lastId
  })
  let transferRoot = jsonRes.transferRootSets.map((x: any) => normalizeEntity(x))

  const maxItemsLength = 1000
  if (transferRoot.length === maxItemsLength) {
    lastId = transferRoot[transferRoot.length - 1].id
    transferRoot = transferRoot.concat(await getTransferRootSet(
      chain,
      token,
      startDate,
      endDate,
      lastId
    ))
  }

  return transferRoot
}

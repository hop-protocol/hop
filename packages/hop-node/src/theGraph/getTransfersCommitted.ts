import makeRequest from './makeRequest'
import { constants } from 'ethers'
import { normalizeEntity } from './shared'

export default async function getTransfersCommitted (
  chain: string,
  token: string,
  lastId: string = constants.AddressZero
) {
  const query = `
    query TransfersCommitted($token: String, $lastId: ID) {
      transfersCommitteds(
        where: {
          id_gt: $lastId
          token: $token
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
    lastId: lastId
  })
  let transfersCommitted = jsonRes.transfersCommitteds.map((x: any) => normalizeEntity(x))

  const maxItemsLength = 1000
  if (transfersCommitted.length === maxItemsLength) {
    lastId = transfersCommitted[transfersCommitted.length - 1].id
    transfersCommitted = transfersCommitted.concat(await getTransfersCommitted(
      chain,
      token,
      lastId
    ))
  }

  return transfersCommitted
}

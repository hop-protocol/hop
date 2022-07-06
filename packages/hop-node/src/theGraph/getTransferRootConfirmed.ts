import makeRequest from './makeRequest'
import { constants } from 'ethers'
import { normalizeEntity } from './shared'

export default async function getTransferRootConfirmed (
  chain: string,
  token: string,
  lastId: string = constants.AddressZero
) {
  const query = `
    query TransferRootConfirmed($token: String, $lastId: ID) {
      transferRootConfirmeds(
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
      }
    }
  `
  const jsonRes = await makeRequest(chain, query, {
    token,
    lastId: lastId
  })
  let transferRoots = jsonRes.transferRootConfirmeds.map((x: any) => normalizeEntity(x))

  const maxItemsLength = 1000
  if (transferRoots.length === maxItemsLength) {
    lastId = transferRoots[transferRoots.length - 1].id
    transferRoots = transferRoots.concat(await getTransferRootConfirmed(
      chain,
      token,
      lastId
    ))
  }

  return transferRoots
}

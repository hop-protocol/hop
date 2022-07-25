import makeRequest from './makeRequest'
import { constants } from 'ethers'
import { normalizeEntity } from './shared'

export default async function getTransferRootBonded (
  chain: string,
  token: string,
  lastId: string = constants.AddressZero
) {
  const query = `
    query TransferRootBonded($token: String, $lastId: ID) {
      transferRootBondeds(
        where: {
          token: $token
          id_gt: $lastId
        },
        orderBy: id,
        orderDirection: asc,
        first: 1000
      ) {
        id
        root
        transactionHash
      }
    }
  `
  const jsonRes = await makeRequest(chain, query, {
    token,
    lastId: lastId
  })
  let transferRoots = jsonRes.transferRootBondeds.map((x: any) => normalizeEntity(x))

  const maxItemsLength = 1000
  if (transferRoots.length === maxItemsLength) {
    lastId = transferRoots[transferRoots.length - 1].id
    transferRoots = transferRoots.concat(await getTransferRootBonded(
      chain,
      token,
      lastId
    ))
  }

  return transferRoots
}

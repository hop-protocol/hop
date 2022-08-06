import { Chain } from 'src/constants'
import { getAllChains } from 'src/config'

export default async function getUnsetTransferRoots (startDate: number, endDate: number) {
  const transferRoots: Record<string, any> = {}
  console.log('fetching bonded roots', Chain.Ethereum, startDate, endDate)
  let items = await getBonds(chain, startDate, endDate)
  for (const item of items) {
    transferRoots[item.transferRootHash] = item
  }

  console.log('fetching confirmed roots', Chain.Ethereum, startDate, endDate)
  items = await getBonds(chain, startDate, endDate)
  for (const item of items) {
    transferRoots[item.transferRootHash] = item
  }

  const setTransferRoots: Record<string, any> = {}
  const chains = getAllChains()
  const transferRootHashes = Object.values(transferRoots).map((x: any) => x.transferRootHash)
  for (const chain of chains) {
    console.log('fetching transferRootSets', chain, transferRootHashes.length)
    const items = await getTransferRootSet(chain, transferRootHashes)
    for (const item of items) {
      setTransferRoots[item.transferRootHash] = item
    }
  }
  const unsetTransferRoots: Record<string, any> = []
  for (const transferRootHash in transferRoots) {
    if (!setTransferRoots[transferRootHash]) {
      unsetTransferRoots[transferRootHash] = transferRoots[transferRootHash]
    }
  }
  return Object.values(unsetTransferRoots)
}

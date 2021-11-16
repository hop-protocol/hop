import Transaction from 'src/models/Transaction'

export const sortByRecentTimestamp = (txs: Transaction[]) => {
  return txs.sort((a, b) => b.timestamp - a.timestamp)
}

export function filterByHash(txs: Transaction[] = [], hash: string = '') {
  return txs.filter(tx => tx.hash !== hash)
}

export async function queryFilterTransferFromL1CompletedEvents(bridge, networkName) {
  const destL2Bridge = await bridge.getL2Bridge(networkName)
  const bln = await destL2Bridge.provider.getBlockNumber()
  const evs = await destL2Bridge.queryFilter(
    destL2Bridge.filters.TransferFromL1Completed(),
    bln - 9999,
    bln
  )
  return evs
}

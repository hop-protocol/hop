import Transaction from 'src/models/Transaction'

export const sortByRecentTimestamp = (txs: Transaction[]) => {
  return txs.sort((a, b) => b.timestamp - a.timestamp)
}

export function filterByHash(txs: Transaction[] = [], hash: string = '') {
  return txs.filter(tx => tx.hash !== hash)
}

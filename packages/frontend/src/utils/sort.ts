import Transaction from 'src/models/Transaction'

export const sortByRecentTimestamp = (list: Transaction[]) => {
  return list.sort((a: Transaction, b: Transaction) => b.timestamp - a.timestamp)
}

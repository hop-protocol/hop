import Transaction from 'src/models/Transaction'

export function createTransaction(tx: Transaction, sourceNetwork, destNetwork, sourceToken) {
  return new Transaction({
    hash: tx?.hash,
    networkName: sourceNetwork?.slug,
    destNetworkName: destNetwork?.slug,
    token: sourceToken,
  })
}

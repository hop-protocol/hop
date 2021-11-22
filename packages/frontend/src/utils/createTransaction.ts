import { providers } from 'ethers'
import Transaction from 'src/models/Transaction'

export function createTransaction(
  tx: Transaction | providers.TransactionResponse,
  sourceNetwork,
  destNetwork,
  sourceToken,
  options?: any
) {
  return new Transaction({
    hash: tx.hash,
    networkName: sourceNetwork?.slug || sourceNetwork,
    destNetworkName: destNetwork?.slug || destNetwork,
    token: sourceToken,
    pendingDestinationConfirmation: options?.pendingDestinationConfirmation,
    destTxHash: options?.destTxHash,
    nonce: tx.nonce,
    from: tx.from,
    to: tx.to,
  })
}

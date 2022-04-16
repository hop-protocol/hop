import { providers } from 'ethers'
import Transaction from 'src/models/Transaction'

export function createTransaction(
  tx: Transaction | providers.TransactionResponse,
  sourceChain,
  destinationChain,
  sourceToken,
  options?: any
) {
  return new Transaction({
    hash: tx.hash,
    networkName: sourceChain?.slug || sourceChain,
    destNetworkName: destinationChain?.slug || destinationChain,
    token: sourceToken,
    pendingDestinationConfirmation: options?.pendingDestinationConfirmation,
    destTxHash: options?.destTxHash,
    nonce: tx.nonce,
    from: tx.from,
    to: tx.to,
  })
}

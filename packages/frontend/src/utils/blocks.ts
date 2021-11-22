import { providers } from 'ethers'

export async function getRecentBlocks(provider: providers.Provider) {
  const blockNumber = await provider.getBlockNumber()
  const nums = [0, 1, 2, 3]
  const recentBlocks = await Promise.all(
    nums.map(num => provider.getBlockWithTransactions(blockNumber - num))
  )

  return recentBlocks
}

export async function getRecentTransactionsByFromAddress(
  provider: providers.Provider,
  fromAddress: string
) {
  const blocks = await getRecentBlocks(provider)
  const txs: providers.TransactionResponse[] = []

  for (const block of blocks) {
    for (const transaction of block.transactions) {
      if (transaction.from.toLowerCase() === fromAddress.toLowerCase()) {
        txs.push(transaction)
      }
    }
  }

  return txs
}

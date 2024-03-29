import { chainIdToSlug, getRpcProvider } from '@hop-protocol/hop-node-core/utils'

export async function getTimestampFromBlockNumberMs (chainId: number, blockNumber: number): Promise<number> {
  const chain = chainIdToSlug(chainId)
  const provider = getRpcProvider(chain)
  const block = await provider.getBlock(blockNumber)
  return block.timestamp * 1000
}

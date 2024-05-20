import { getRpcProvider } from '#utils/getRpcProvider.js'
import { getChainSlug, ChainSlug } from '@hop-protocol/sdk'

export async function getTimestampFromBlockNumberMs (chainId: number, blockNumber: number): Promise<number> {
  const chainSlug = getChainSlug(chainId.toString())
  const provider = getRpcProvider(chainSlug as ChainSlug)
  const block = await provider.getBlock(blockNumber)
  return block.timestamp * 1000
}

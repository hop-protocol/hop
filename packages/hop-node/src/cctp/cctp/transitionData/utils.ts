import { getRpcProvider } from '@hop-protocol/hop-node-core'
import { getChain } from '@hop-protocol/sdk'

export async function getTimestampFromBlockNumberMs (chainId: number, blockNumber: number): Promise<number> {
  const chain = getChain(chainId).slug
  const provider = getRpcProvider(chain)
  const block = await provider.getBlock(blockNumber)
  return block.timestamp * 1000
}

import chainIdToSlug from 'src/utils/chainIdToSlug'
import { getRpcProvider } from 'src/utils/getRpcProvider'

export async function getTimestampFromBlockNumberMs (chainId: number, blockNumber: number): Promise<number> {
  const chain = chainIdToSlug(chainId)
  const provider = getRpcProvider(chain)
  const block = await provider.getBlock(blockNumber)
  return block.timestamp * 1000
}

import { getRpcProvider } from '#utils/getRpcProvider.js'
import type { DecodedLogWithContext } from '#types/index.js'

export async function getBlockTimestampFromLogMs (log: DecodedLogWithContext): Promise<number> {
  const { context, blockNumber } = log
  const provider = getRpcProvider(context.chainId)
  const block = await provider.getBlock(blockNumber)
  return block.timestamp * 1000
}

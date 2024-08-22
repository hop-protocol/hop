import { getRpcProvider } from '#utils/getRpcProvider.js'
import type { EthersEventWithDecodedTypes } from '@hop-protocol/sdk'

export async function getBlockTimestampFromLogMs (log: EthersEventWithDecodedTypes): Promise<number> {
  const { context, blockNumber } = log
  const provider = getRpcProvider(context.chainId)
  const block = await provider.getBlock(blockNumber)
  return block.timestamp * 1000
}

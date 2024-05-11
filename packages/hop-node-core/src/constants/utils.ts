import { ChainSlug, NetworkSlug, getChains} from '@hop-protocol/sdk'

type AverageBlockTimeSeconds = Partial<Record<ChainSlug, number>>

export function getAverageBlockTimeSeconds(): AverageBlockTimeSeconds {
  /**
   * Some chains have a variable block time with a single tx per block. Use
   * 250ms for these chains as an approximation, following the lead
   * of https://www.rollup.codes/
   */
  const BLOCK_TIME_FOR_SINGLE_TX_BLOCKS_MS = 250

  const avgBlockTimeSeconds: AverageBlockTimeSeconds = {}
  for (const chain of getChains(NetworkSlug.Mainnet)) {
    const blockTimeMs = chain.averageBlockTimeMs
    if (blockTimeMs !== BLOCK_TIME_FOR_SINGLE_TX_BLOCKS_MS) {
      avgBlockTimeSeconds[chain.slug] = blockTimeMs / 1000
    }
  }

  return avgBlockTimeSeconds
}

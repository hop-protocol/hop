import { ChainSlug, NetworkSlug, getChain } from '@hop-protocol/sdk'
import { SignerConfig } from '#config/index.js'

const DEFAULT_START_BLOCK_NUMBER: Record<string, Partial<Record<ChainSlug, number>>> = {
  // TODO: Fill in the start block numbers
  [NetworkSlug.Mainnet]: {
    [ChainSlug.Ethereum]: 0,
    [ChainSlug.Optimism]: 0,
    [ChainSlug.Arbitrum]: 0,
    [ChainSlug.Base]: 0,
    [ChainSlug.Polygon]: 0
  },
  [NetworkSlug.Sepolia]: {
    [ChainSlug.Ethereum]: 0,
    [ChainSlug.Optimism]: 0,
    [ChainSlug.Arbitrum]: 0,
    [ChainSlug.Base]: 0
  }
}

export function getRailsStartBlockNumber (chainId: string): number {
  const chainSlug = getChain(chainId).slug
  return (DEFAULT_START_BLOCK_NUMBER as any)[SignerConfig.network as NetworkSlug][chainSlug]
}

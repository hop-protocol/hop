import { ChainSlug, NetworkSlug, getChain } from '@hop-protocol/sdk'
import { Config } from '#config/index.js'

const DEFAULT_START_BLOCK_NUMBER: Record<string, Partial<Record<ChainSlug, number>>> = {
  // TODO: SDK: Fill in the start block numbers
  // TODO: SDK: These live in the SDK
  [NetworkSlug.Mainnet]: {
    [ChainSlug.Ethereum]: 0,
    [ChainSlug.Optimism]: 0,
    [ChainSlug.Arbitrum]: 0,
    [ChainSlug.Base]: 0,
    [ChainSlug.Polygon]: 0
  },
  [NetworkSlug.Sepolia]: {
    [ChainSlug.Ethereum]: 8812404,
    [ChainSlug.Optimism]: 0,
    [ChainSlug.Arbitrum]: 0,
    [ChainSlug.Base]: 28675493
  }
}

export function getRailsStartBlockNumber (chainId: string): number {
  const chainSlug = getChain(chainId).slug
  return (DEFAULT_START_BLOCK_NUMBER as any)[Config.GlobalConfig.options.network as NetworkSlug][chainSlug]
}

/**
 * Type Guards
 */

export function isValidBondTxInputData (item: unknown): item is BondInput {
  if (typeof item !== 'object' || item === null) {
    return false
  }

  const candidate = item as Partial<BondInput>
  return (
    'pathId' in candidate &&
    'claimId' in candidate &&
    'bonderFee' in candidate &&
    'nextHops' in candidate &&
    typeof candidate.pathId === 'string' &&
    typeof candidate.claimId === 'string' &&
    // typeof candidate.bonderFee?.toString() === 'string' &&
    Array.isArray(candidate.nextHops)
    // TODO: Is that a valid assumption?
    // NOTE: This does not validate the nextHops array. It is assumed that the
    // array is correctly formatted
  )
}

// TODO: The BigNumberish types should be checked for correctness. Possibly introduce isBigNumberish
export function isValidPostClaimTxInputData (item: unknown): item is PostClaimInput {
  if (typeof item !== 'object' || item === null) {
    return false
  }

  const candidate = item as Partial<PostClaimInput>
  return (
    'pathId' in candidate &&
    'claimId' in candidate &&
    'to' in candidate &&
    'amount' in candidate &&
    'maxBonderFee' in candidate &&
    'attestedClaimId' in candidate &&
    'sourcePool' in candidate &&
    'nextHopsHash' in candidate &&
    typeof candidate.pathId === 'string' &&
    typeof candidate.claimId === 'string' &&
    typeof candidate.to === 'string' &&
    // typeof candidate.amount?.toString() === 'string' &&
    // typeof candidate.maxBonderFee?.toString() === 'string' &&
    typeof candidate.attestedClaimId === 'string' &&
    // typeof candidate.sourcePool?.toString() === 'string' &&
    typeof candidate.nextHopsHash === 'string'
  )
}

// TODO: The BigNumberish types should be checked for correctness. Possibly introduce isBigNumberish
export function isValidRemoveClaimTxInputData (item: unknown): item is RemoveClaimInput{
  if (typeof item !== 'object' || item === null) {
    return false
  }

  const candidate = item as Partial<RemoveClaimInput>
  return (
    'pathId' in candidate &&
    'claimId' in candidate &&
    typeof candidate.pathId === 'string' &&
    typeof candidate.claimId === 'string'
  )
}

export function isValidReaddClaimTxInputData (item: unknown): item is ReaddClaimInput{
  if (typeof item !== 'object' || item === null) {
    return false
  }

  const candidate = item as Partial<ReaddClaimInput>
  return (
    'pathId' in candidate &&
    'transferDataHash' in candidate &&
    'claimId' in candidate &&
    typeof candidate.pathId === 'string' &&
    typeof candidate.transferDataHash === 'string' &&
    typeof candidate.claimId === 'string'
  )
}
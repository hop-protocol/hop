import { ChainSlug, NetworkSlug, getChain } from '@hop-protocol/sdk'
import { Config } from '#config/index.js'
import {
  getPathId,
  type BondInput,
  type PushClaimInput,
  type ReaddClaimInput,
  type RemoveClaimInput,
} from './RailsSDKWrapper.js'
import type { RailsPath } from './types.js'
import type { RequiredEventFilter } from '#types/index.js'

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
    [ChainSlug.Ethereum]: 7784611,
    [ChainSlug.Optimism]: 0,
    [ChainSlug.Arbitrum]: 0,
    [ChainSlug.Base]: 22371334
  }
}

export function getRailsStartBlockNumber (chainId: string): number {
  const chainSlug = getChain(chainId).slug
  return (DEFAULT_START_BLOCK_NUMBER as any)[Config.GlobalConfig.options.network as NetworkSlug][chainSlug]
}

/**
 * Events
 */

// TODO: Move this to #indexer/utils.ts when aggregation is implemented at the indexer level
export function aggregateFilters(filters: RequiredEventFilter[]): RequiredEventFilter[] {
  const filtersByAddress: Record<string, RequiredEventFilter> = {}

  filters.forEach((filter: RequiredEventFilter) => {
    const address = filter.address
    const existingFilter = filtersByAddress[address] ?? { address, topics: [] }

    filter.topics.forEach((topic, i) => {
      if (!existingFilter.topics![i]) {
        existingFilter.topics![i] = []
      }
      if (!existingFilter.topics![i]!.includes(topic as string)) {
        (existingFilter.topics![i] as string[]).push(topic as string)
      }
    })

    filtersByAddress[address] = existingFilter
  })

  return Object.values(filtersByAddress).map(filter => ({
    ...filter,
  }))
}

/**
 * Paths
 */

export function getPathFromPathId (pathId: string): RailsPath {
  const paths: RailsPath[] = Config.ClientConfig.rails.paths
  const path: RailsPath | undefined = paths.find(path => getPathId(path) === pathId)
  if (!path) {
    throw new Error(`Path not found for pathId: ${pathId}`)
  }

  return path
}

export function getChainIdsForPaths(paths: RailsPath[]): string[] {
  return paths.reduce((chainIds: string[], path: RailsPath) => {
    if (!chainIds.includes(path.chainId)) {
      chainIds.push(path.chainId)
    }
    if (!chainIds.includes(path.counterpartChainId)) {
      chainIds.push(path.counterpartChainId)
    }
    return chainIds
  }, [])
}

export function getPathIdsPerChainId(chainId: string, paths: RailsPath[]): string[] {
  return paths.reduce((pathIds: string[], path: RailsPath) => {
    if (path.chainId === chainId) {
      pathIds.push(getPathId(path))
    }
    if (path.counterpartChainId === chainId) {
      pathIds.push(getPathId(path))
    }
    return pathIds
  }, [])
}

export function getCounterpartChainIdForPathId(chainId: string, pathId: string): string {
  const path = getPathFromPathId(pathId)
  if (path.chainId === chainId) {
    return path.counterpartChainId
  }
  if (path.counterpartChainId === chainId) {
    return path.chainId
  }
  throw new Error(`ChainId not found in path: ${chainId}`)
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
export function isValidPushClaimTxInputData (item: unknown): item is PushClaimInput {
  if (typeof item !== 'object' || item === null) {
    return false
  }

  const candidate = item as Partial<PushClaimInput>
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
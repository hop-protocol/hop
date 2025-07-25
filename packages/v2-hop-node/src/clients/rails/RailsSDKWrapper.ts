import {
  type TransferSent,
  type ClaimBonded,
  type ClaimPosted,
  type ClaimRemoved,
  type ClaimReadded,
  type ClaimBonded as ClaimBondedSDK,
  type ClaimPosted as ClaimPostedSDK,
  type ClaimRemoved as ClaimRemovedSDK,
  type ClaimReadded as ClaimReaddedSDK,
  type TransferSentIndexes,
  type ClaimBondedIndexes,
  type ClaimPostedIndexes,
  type ClaimReaddedIndexes,
  type ClaimRemovedIndexes,
  type PostClaimInput,
  type BondInput,
  type EthersEventWithDecodedTypesAndBaseContext,
  type RemoveClaimInput,
  type ReaddClaimInput,
  EventName as RailsPathEventName,
  RailsPath as RailsPathSDK,
  RailsGateway as RailsGatewaySDK,
  StakingRegistry as StakingRegistrySDK,
  utils as RailsUtils,
} from '@hop-protocol/v2-sdk'
import type {
  EventFilter,
  Signer,
  Overrides,
  providers
} from 'ethers'
import { wallets } from '#wallets/index.js'
import type { RailsHop, RailsPath, RailsPathAddresses } from './types.js'
import type { DecodedLogWithContext } from '#types/index.js'
import type { BigNumber } from 'ethers'

export type RailsFilterInputs = &
  TransferSentIndexes &
  ClaimBondedIndexes &
  ClaimPostedIndexes &
  ClaimReaddedIndexes &
  ClaimRemovedIndexes

export type RailsEvent = |
  TransferSent |
  ClaimBonded |
  ClaimPosted |
  ClaimRemoved |
  ClaimReadded

export enum RailsEventName {
  TransferSent = RailsPathEventName.TransferSent,
  ClaimBonded = RailsPathEventName.ClaimBonded,
  ClaimPosted = RailsPathEventName.ClaimPosted,
  ClaimReadded = RailsPathEventName.ClaimReadded,
  ClaimRemoved = RailsPathEventName.ClaimRemoved,
}

// TODO: Get this from SDK
enum RailsMethodName {
  Bond = 'bond',
  PostClaim = 'postClaim',
  RemoveClaim = 'removeClaim',
  ReaddClaim = 'readdClaim'
}

export {
  RailsMethodName,
  type TransferSent,
  type ClaimBonded,
  type ClaimPosted,
  type ClaimRemoved,
  type ClaimReadded,
  type BondInput,
  type PostClaimInput,
  type RemoveClaimInput,
  type ReaddClaimInput
}

// TODO: This should be named (or separated into) RailsPath
export class RailsGateway {
  #sdk: RailsGatewaySDK
  #stakingRegistry: StakingRegistrySDK
  // TODO: This should be handled within the system, not at the SDK level
  static #addressToPathIdCache: Record<string, string> = {}
  static #pathIdToAddressCache: Record<string, string> = {}

  constructor (chainId: string, signerOrProvider: Signer | providers.Provider) {
    const signer = signerOrProvider as Signer
    this.#sdk = new RailsGatewaySDK({ chainId, signerOrProvider: signer })
    this.#stakingRegistry = new StakingRegistrySDK({ chainId, signerOrProvider: signer })
  }

  /**
   * Factory method to create a RailsPath instance
   */

  getRailsPath (pathId: string): RailsPathClass {
    // TODO: This should be cached in the SDK as to not create new instances each time

    const chainId = this.#sdk.chainId
    if (!chainId) {
      throw new Error('Chain ID is not set in RailsGatewaySDK')
    }
    const address = RailsGateway.getPathCache(String(chainId), pathId)
    // TODO: V2: This should just be getRailsPath, but legacy code needs to be updated
    // TODO: V2: This is hacky way to mock SDK for now. All this should live in the SDK.
    const railsPathSDK = this.#sdk.getRailsPathByAddress(address)
    return new RailsPathClass(railsPathSDK)
  }

  /**
   * Cache methods
   */

  // TODO: V2: Not production code, just a mock for now
  static setPathCache (chainId: string, address: string, pathId: string): void {
    if (!chainId || !address || !pathId) {
      throw new Error('Invalid chainId, address, or pathId')
    }

    const addressCacheKey = `${chainId}:${address}`
    if (this.#addressToPathIdCache[addressCacheKey]) {
      throw new Error(`Path ID already exists in cache: ${addressCacheKey}`)
    }
    this.#addressToPathIdCache[addressCacheKey] = pathId

    const pathIdCacheKey = `${chainId}:${pathId}`
    if (this.#pathIdToAddressCache[pathIdCacheKey]) {
      throw new Error(`Path address already exists in cache: ${pathIdCacheKey}`)
    }
    this.#pathIdToAddressCache[pathIdCacheKey] = address
  }

  // TODO: V2: Not production code, just a mock for now
  static getPathCache(chainId: string, addressOrPathId: string): string {
    if (!chainId || !addressOrPathId) {
      throw new Error('Invalid chainId or addressOrPathId')
    }

    const addressKey = `${chainId}:${addressOrPathId}`
    const pathIdKey = `${chainId}:${addressOrPathId}`

    const address = this.#addressToPathIdCache[addressKey]
    if (address && address.length > 0) {
      return address
    }

    const pathId = this.#pathIdToAddressCache[pathIdKey]
    if (pathId && pathId.length > 0) {
      return pathId
    }

    throw new Error(`No cache entry found for chainId: ${chainId}, addressOrPathId: ${addressOrPathId}`)
  }

  /**
   * Getter methods
   */


  async isStaked(): Promise<boolean> {
    return this.#stakingRegistry.helpers.isStaked()
  }

  async minHopStake(): Promise<BigNumber> {
    return this.#stakingRegistry.minHopStake()
  }

  async getStakeBalance(): Promise<BigNumber> {
    return this.#stakingRegistry.helpers.getBalance()
  }

  /**
   * Transactional Methods
   */

  async bond (input: BondInput, overrides: Overrides): Promise<providers.TransactionResponse> {
    return this.#sdk.bond({ ...input, ...overrides })
  }

  async postClaim (input: PostClaimInput, overrides: Overrides): Promise<providers.TransactionResponse> {
    return this.#sdk.postClaim({ ...input, ...overrides })
  }

  async removeClaim(input: RemoveClaimInput, overrides: Overrides): Promise<providers.TransactionResponse> {
    return this.#sdk.removeClaim({ ...input, ...overrides })
  }

  async readdClaim(input: ReaddClaimInput, overrides: Overrides): Promise<providers.TransactionResponse> {
    // return this.#sdk.readdClaim({ ...input, ...overrides })
    throw new Error('Method not implemented')
  }

  async stakeHop(amount: BigNumber): Promise<providers.TransactionResponse> {
    return this.#stakingRegistry.helpers.stakeHop(amount)
  }

  async unstakeHop(amount: BigNumber): Promise<providers.TransactionResponse> {
    return this.#stakingRegistry.unstakeHop({ amount })
  }

  async withdrawStake(amount: BigNumber): Promise<providers.TransactionResponse> {
    return this.#stakingRegistry.withdrawStake({ amount })
  }

  /**
   * Helpers
   */

  async getIsPathIdLive (pathId: string): Promise<boolean> {
    return this.#sdk.helpers.getIsPathIdLive({ pathId })
  }

  async getNeedsApprovalForStake (amount: BigNumber): Promise<boolean> {
    return this.#stakingRegistry.helpers.getNeedsApprovalForStake({ amount })
  }

  async getHopBalance(): Promise<BigNumber> {
    return this.#stakingRegistry.helpers.getHopTokenBalance()
  }

  async approveStake(amount: BigNumber): Promise<providers.TransactionResponse> {
    return this.#stakingRegistry.helpers.approveStake({ amount })
  }

}

// TODO: V2: Rename when in SDK
export class RailsPathClass {
  #sdk: RailsPathSDK

  constructor (railsPathSDK: RailsPathSDK) {
    this.#sdk = railsPathSDK
  }

  async isPosted(claimId: string): Promise<boolean> {
    return this.#sdk.helpers.getIsClaimPosted({ claimId })
  }

  // async isClaimed(pathId: string, transferId: string): Promise<boolean> {
  //   return this.#sdk.helpers.getIsTransferClaimed({ transferId })
  // }

  async isBonded(claimId: string): Promise<boolean> {
    return this.#sdk.helpers.getIsClaimBondedOrWithdrawn({ claimId })
  }
}

/**
 * Utils
 */

export function getRailsEventFilter <T extends RailsFilterInputs>(eventName: RailsEventName, chainId: string, railsPathAddress: string, indexes?: T): EventFilter {
  const wallet = wallets.get(chainId)
  const railsPath = new RailsPathSDK({ chainId, signerOrProvider: wallet, address: railsPathAddress })
  // TODO: Not any
  return railsPath.getEventFilter(eventName as any, indexes)
}

// TODO: Consider way to not pass in chainId. Right now, SDK needs it since it has large response. However, from the perspective
// of the hn it is not necessary and adds confusion. This is because the response to the method should not care about
// the chainId, so the intention of the method is not clear.
export function addDecodedTypesToEvent(log: providers.Log, chainId: string): DecodedLogWithContext<TransferSent | ClaimBondedSDK | ClaimPostedSDK | ClaimRemovedSDK | ClaimReaddedSDK> {
  const res: EthersEventWithDecodedTypesAndBaseContext<any> = RailsPathSDK.addDecodedTypesToEvent(log, chainId)

  // TODO: Temp do this until hn and sdk are in sync
  if (!res?.context?.eventName) {
    throw new Error('Event name not found in decoded event')
  }
  return {
    ...res,
    decoded: res.decoded,
    context: {
      eventName: res.context.eventName,
      chainId
    }
  }
}

export async function getRailsPathAddress(pathId: string, chainId: string): Promise<string> {
  const wallet = wallets.get(chainId)
  const gateway = new RailsGatewaySDK({ chainId: chainId, signerOrProvider: wallet })
  const pathInstance = await gateway.getRailsPath(pathId)

  return pathInstance.getRailsPathContractAddress()
}

export function getComputedNextHopsHash (nextHops: RailsHop[]): string {
  return RailsUtils.getComputedNextHopsHash(nextHops)
}

export function getPathId(path: RailsPath): string {
  return RailsUtils.getComputedPathId(
    path.chainId,
    path.token,
    path.counterpartChainId,
    path.counterpartToken,
    path.initialReserve
  )
}

// The expectation is ContractFunctionRevertedError, not Error, but it is not exported from the SDK,
// which is expected. The Error is just used as a mock for now since the SDK will return it but
// should not export it (as it currently, correctly does).
export function isContractError (err: unknown): err is Error /*ContractFunctionRevertedError*/ {
  return true
}

export async function getAddressesForRailsPath (path: RailsPath): Promise<RailsPathAddresses> {
  if (!path || !path.chainId || !path.token) {
    throw new Error('Invalid path input: chainId and token are required')
  }

  const pathId = getPathId(path)

  const wallet = wallets.get(path.chainId)
  const gateway = new RailsGatewaySDK({ chainId: path.chainId, signerOrProvider: wallet })
  const pathInstance = await gateway.getRailsPath(pathId)

  const counterpartWallet = wallets.get(path.counterpartChainId)
  const gatewayCounterpart = new RailsGatewaySDK({ chainId: path.counterpartChainId, signerOrProvider: counterpartWallet })
  const counterpartPathInstance = await gatewayCounterpart.getRailsPath(pathId)

  return {
    pathAddress: pathInstance.getRailsPathContractAddress(),
    counterpartPathAddress: counterpartPathInstance.getRailsPathContractAddress()
  }
}

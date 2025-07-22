import {
  type TransferSent,
  type ClaimBonded,
  type ClaimPushed,
  type ClaimRemoved,
  type ClaimReadded,
  type ClaimBonded as ClaimBondedSDK,
  type ClaimPushed as ClaimPushedSDK,
  type ClaimRemoved as ClaimRemovedSDK,
  type ClaimReadded as ClaimReaddedSDK,
  type TransferSentIndexes,
  type ClaimBondedIndexes,
  type ClaimPushedIndexes,
  type ClaimReaddedIndexes,
  type ClaimRemovedIndexes,
  type PushClaimInput,
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
  ClaimPushedIndexes &
  ClaimReaddedIndexes &
  ClaimRemovedIndexes

export type RailsEvent = |
  TransferSent |
  ClaimBonded |
  ClaimPushed |
  ClaimRemoved |
  ClaimReadded

export enum RailsEventName {
  TransferSent = RailsPathEventName.TransferSent,
  ClaimBonded = RailsPathEventName.ClaimBonded,
  ClaimPushed = RailsPathEventName.ClaimPushed,
  ClaimReadded = RailsPathEventName.ClaimReadded,
  ClaimRemoved = RailsPathEventName.ClaimRemoved,
}

// TODO: Get this from SDK
enum RailsMethodName {
  Bond = 'bond',
  PushClaim = 'pushClaim',
  RemoveClaim = 'removeClaim',
  ReaddClaim = 'readdClaim'
}

export {
  RailsMethodName,
  type TransferSent,
  type ClaimBonded,
  type ClaimPushed,
  type ClaimRemoved,
  type ClaimReadded,
  type BondInput,
  type PushClaimInput,
  type RemoveClaimInput,
  type ReaddClaimInput
}

export class RailsGateway {
  #sdk: RailsGatewaySDK
  #stakingRegistry: StakingRegistrySDK

  constructor (chainId: string, signerOrProvider: Signer | providers.Provider) {
    const signer = signerOrProvider as Signer
    this.#sdk = new RailsGatewaySDK({ chainId, signerOrProvider: signer })
    this.#stakingRegistry = new StakingRegistrySDK({ chainId, signerOrProvider: signer })
  }

  /**
   * Getter methods
   */

  async isPushed(pathId: string, claimId: string): Promise<boolean> {
    return this.#sdk.helpers.getIsClaimPushed({ pathId, claimId })
  }

  // async isClaimed(pathId: string, transferId: string): Promise<boolean> {
  //   return this.#sdk.helpers.getIsTransferClaimed({ transferId })
  // }

  async isBonded(pathId: string, claimId: string): Promise<boolean> {
    return this.#sdk.helpers.getIsClaimBondedOrWithdrawn({ pathId, claimId })
  }

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

  async pushClaim (input: PushClaimInput, overrides: Overrides): Promise<providers.TransactionResponse> {
    return this.#sdk.pushClaim({ ...input, ...overrides })
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
export function addDecodedTypesToEvent(log: providers.Log, chainId: string): DecodedLogWithContext<TransferSent | ClaimBondedSDK | ClaimPushedSDK | ClaimRemovedSDK | ClaimReaddedSDK> {
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

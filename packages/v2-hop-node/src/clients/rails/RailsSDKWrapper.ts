import {
  type EthersEventWithDecodedTypes,
  type TransferSent as TransferSentSDK,
  type TransferBonded as TransferBondedSDK,
  type ClaimPosted as ClaimPostedSDK,
  type ClaimReadded as ClaimReaddedSDK,
  type ClaimRemoved as ClaimRemovedSDK,
  type GetTransferSentEventFilterInput,
  type GetTransferBondedEventFilterInput,
  type PostClaimInput,
  type BondInput,
  RailsGateway as RailsGatewaySDK,
  utils as RailsUtils,
  RailsGatewayEventName
} from '@hop-protocol/v2-sdk'
import type {
  EventFilter,
  Signer,
  Overrides,
  providers
} from 'ethers'
import { wallets } from '#wallets/index.js'
import type { RailsPath } from './types.js'

export type BondInputSDK = BondInput
export type PostClaimInputSDK = PostClaimInput
export type RailsFilterInputs = GetTransferSentEventFilterInput & GetTransferBondedEventFilterInput


export enum EventName {
  TransferSent = 'TransferSent',
  TransferPosted = 'TransferPosted',
  TransferBonded = 'TransferBonded',
  ClaimPosted = 'ClaimPosted', // This is a mock until live in contract
  ClaimRemoved = 'ClaimRemoved', // This is a mock until live in contract
  ClaimConfirmed = 'ClaimConfirmed', // This is a mock until live in contract
  // TODO: any others
}

export class RailsGateway {
  #sdk: RailsGatewaySDK

  constructor (chainId: string, signerOrProvider: Signer | providers.Provider) {
    const signer = signerOrProvider as Signer
    this.#sdk = new RailsGatewaySDK({ chainId, signerOrProvider: signer })
  }

  /**
   * Getter methods
   */

  async isPosted(transferId: string): Promise<boolean> {
    return true
  }

  async isClaimed(transferId: string): Promise<boolean> {
    return true
  }

  async isBonded(transferId: string): Promise<boolean> {
    return true
  }

  /**
   * Transactional Methods
   */

  async bond (input: BondInputSDK, overrides: Overrides): Promise<providers.TransactionResponse> {
    return this.#sdk.bond({ ...input, ...overrides })
  }

  async postClaim (input: PostClaimInputSDK, overrides: Overrides): Promise<providers.TransactionResponse> {
    return this.#sdk.postClaim({ ...input, ...overrides })
  }

  /**
   * Helpers
   */


  async getIsPathIdLive (pathId: string): Promise<boolean> {
    return this.#sdk.helpers.getIsPathIdLive({ pathId })
  }
}

/**
 * Utils
 */

export function getRailsEventFilter <T extends RailsFilterInputs>(eventName: EventName, chainId: string, indexes?: T): EventFilter {
  const wallet = wallets.get(chainId)
  const gateway = new RailsGatewaySDK({ chainId, signerOrProvider: wallet })
  // TODO: Fix this
  // return gateway.getEventFilter(eventName as RailsGatewayEventName, indexes)
  return gateway.getEventFilter(eventName as any, indexes)
}

export function addDecodedTypesToEvent(log: providers.Log): EthersEventWithDecodedTypes<TransferSentSDK | TransferBondedSDK | ClaimPostedSDK | ClaimReaddedSDK | ClaimRemovedSDK> {
  return RailsGatewaySDK.addDecodedTypesToEvent(log)
}

export function getPathId(path: RailsPath): string {
  return RailsUtils.getComputedPathId(
    path.srcChainId,
    path.srcToken,
    path.destChainId,
    path.destToken
  )
}

// The expectation is ContractFunctionRevertedError, not Error, but it is not exported from the SDK,
// which is expected. The Error is just used as a mock for now since the SDK will return it but
// should not export it (as it currently, correctly does).
export function isContractError (err: unknown): err is Error /*ContractFunctionRevertedError*/ {
  return true
}

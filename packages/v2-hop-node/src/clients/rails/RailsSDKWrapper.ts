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
import type { DecodedLogWithContext } from '#types/index.js'

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

export function getRailsEventFilter <T extends RailsFilterInputs>(eventName: RailsEventName, chainId: string, indexes?: T): EventFilter {
  const wallet = wallets.get(chainId)
  const gateway = new RailsGatewaySDK({ chainId, signerOrProvider: wallet })
  // TODO: Fix this
  // return gateway.getEventFilter(eventName as RailsGatewayEventName, indexes)
  return gateway.getEventFilter(eventName as any, indexes)
}

// TODO: Consider way to not pass in chainId. Right now, SDK needs it since it has large response. However, from the perspective
// of the hn it is not necessary and adds confusion. This is because the response to the method should not care about
// the chainId, so the intention of the method is not clear.
export function addDecodedTypesToEvent(log: providers.Log, chainId: string): DecodedLogWithContext<TransferSentSDK | TransferBondedSDK | ClaimPostedSDK | ClaimRemovedSDK | ClaimReaddedSDK> {
  const res: EthersEventWithDecodedTypesAndBaseContext<any> = RailsGatewaySDK.addDecodedTypesToEvent(log, chainId)

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

export function getPathId(path: RailsPath): string {
  return RailsUtils.getComputedPathId(
    path.srcChainId,
    path.srcToken,
    path.destChainId,
    path.destToken,
    path.initialReserve
  )
}

// The expectation is ContractFunctionRevertedError, not Error, but it is not exported from the SDK,
// which is expected. The Error is just used as a mock for now since the SDK will return it but
// should not export it (as it currently, correctly does).
export function isContractError (err: unknown): err is Error /*ContractFunctionRevertedError*/ {
  return true
}

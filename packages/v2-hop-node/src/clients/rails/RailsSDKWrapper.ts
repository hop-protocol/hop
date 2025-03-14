import {
  type TransferSent,
  type TransferBonded,
  type ClaimPushed,
  type ClaimRemoved,
  type ClaimReadded,
  type TransferBonded as TransferBondedSDK,
  type ClaimPushed as ClaimPushedSDK,
  type ClaimRemoved as ClaimRemovedSDK,
  type ClaimReadded as ClaimReaddedSDK,
  type GetTransferSentEventFilterInput,
  type GetTransferBondedEventFilterInput,
  type GetClaimPushedEventFilterInput,
  type GetClaimReaddedEventFilterInput,
  type GetClaimRemovedEventFilterInput,
  type PushClaimInput,
  type BondInput,
  type EthersEventWithDecodedTypesAndBaseContext,
  type RemoveClaimInput,
  type ReaddClaimInput,
  RailsGateway as RailsGatewaySDK,
  utils as RailsUtils,
  RailsGatewayEventName as RailsGatewayEventNameSDK,
  RailsGatewayMethodName as RailsMethodName
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

export type RailsFilterInputs = &
  GetTransferSentEventFilterInput &
  GetTransferBondedEventFilterInput &
  GetClaimPushedEventFilterInput &
  GetClaimReaddedEventFilterInput &
  GetClaimRemovedEventFilterInput

export type RailsEvent = |
  TransferSent |
  TransferBonded |
  ClaimPushed |
  ClaimRemoved |
  ClaimReadded


export enum RailsEventName {
  TransferSent = RailsGatewayEventNameSDK.TransferSent,
  TransferBonded = RailsGatewayEventNameSDK.TransferBonded,
  ClaimPushed = RailsGatewayEventNameSDK.ClaimPushed,
  ClaimRemoved = RailsGatewayEventNameSDK.ClaimRemoved,
  ClaimReadded = RailsGatewayEventNameSDK.ClaimReadded,
}

export {
  RailsMethodName,
  type TransferSent,
  type TransferBonded,
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

  constructor (chainId: string, signerOrProvider: Signer | providers.Provider) {
    const signer = signerOrProvider as Signer
    this.#sdk = new RailsGatewaySDK({ chainId, signerOrProvider: signer })
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
export function addDecodedTypesToEvent(log: providers.Log, chainId: string): DecodedLogWithContext<TransferSent | TransferBondedSDK | ClaimPushedSDK | ClaimRemovedSDK | ClaimReaddedSDK> {
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

import {
  type EthersEventWithDecodedTypes,
  type TransferSent as TransferSentSDK,
  type TransferBonded as TransferBondedSDK,
  type GetTransferSentEventFilterInput,
  type GetTransferBondedEventFilterInput,
  type PostClaimInput as PostClaimInputSDK,
  type BondInput as BondInputSDK,
  RailsGateway as RailsGatewaySDK
} from '@hop-protocol/v2-sdk'
import type {
  EventFilter,
  Signer,
  Overrides,
  providers
} from 'ethers'
import { wallets } from '#wallets/index.js'
import type { RailsPath } from './types.js'

export type RailsFilterInputs = GetTransferSentEventFilterInput['indexes'] & GetTransferBondedEventFilterInput['indexes']


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

  async populateBond (input: BondInputSDK): Promise<providers.TransactionRequest> {
    return this.#sdk.populateTransaction.bond(input)
  }

  async populatePostClaim (input: PostClaimInputSDK): Promise<providers.TransactionRequest> {
    return this.#sdk.populateTransaction.postClaim(input)
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
  switch (eventName) {
    case EventName.TransferSent:
      return gateway.getTransferSentEventFilter({ indexes })
    // case EventName.TransferPosted:
    //   return gateway.getTransferPostedEventFilter({ chainId, indexes })
    case EventName.TransferBonded:
      return gateway.getTransferBondedEventFilter({ indexes })
    default:
      throw new Error(`Unknown event name: ${JSON.stringify(eventName)}`)
  }
}

export function addDecodedTypesToEvent(log: providers.Log): EthersEventWithDecodedTypes<TransferSentSDK | TransferBondedSDK> {
  return RailsGatewaySDK.addDecodedTypesToEvent(log)
}

export function getPathId(path: RailsPath): string {
  return ''
}

// The expectation is ContractFunctionRevertedError, not Error, but it is not exported from the SDK,
// which is expected. The Error is just used as a mock for now since the SDK will return it but
// should not export it (as it currently, correctly does).
export function isContractError (err: unknown): err is Error /*ContractFunctionRevertedError*/ {
  return true
}

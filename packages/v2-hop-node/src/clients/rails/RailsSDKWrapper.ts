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
import type { RailsPath } from './types.js'

export type PostClaimInput = Omit<PostClaimInputSDK, 'chainId'>
export type BondInput = Omit<BondInputSDK, 'chainId'>

export type RailsFilterInputs = GetTransferSentEventFilterInput['indexes'] | GetTransferBondedEventFilterInput['indexes']

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

  constructor (signerOrProvider: Signer | providers.Provider) {
    const signer = signerOrProvider as Signer
    this.#sdk = new RailsGatewaySDK({ network: 'mainnet', signer })
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

  async bond (input: BondInput, overrides: Overrides): Promise<providers.TransactionResponse> {
    return this.#sdk.bond(input as BondInputSDK/*, overrides*/)
  }

  async postClaim (input: PostClaimInput, overrides: Overrides): Promise<providers.TransactionResponse> {
    return this.#sdk.postClaim(input as PostClaimInputSDK/*, overrides*/)
  }

  /**
   * Helpers
   */


  async getIsPathIdLive (pathId: string): Promise<boolean> {
    const signer = this.#sdk.getSigner()
    if (!signer) {
      throw new Error('Signer not found')
    }
    const chainId = (await signer.getChainId()).toString()
    return this.#sdk.getIsPathIdLive({ chainId, pathId })
  }
}

/**
 * Utils
 */

// Does not matter if in utils, just care about this being exported
// import { RailsGateway, getRailsEventFilter } from '@hop-protocol/v2-sdk'
export function getRailsEventFilter <T extends RailsFilterInputs>(eventName: EventName, chainId: string, indexes?: T): EventFilter {
  const gateway = new RailsGatewaySDK({ network: 'mainnet'})
  switch (eventName) {
    case EventName.TransferSent:
      return gateway.getTransferSentEventFilter({ chainId, indexes })
    // case EventName.TransferPosted:
    //   return gateway.getTransferPostedEventFilter({ chainId, indexes })
    case EventName.TransferBonded:
      return gateway.getTransferBondedEventFilter({ chainId, indexes })
    default:
      throw new Error(`Unknown event name: ${JSON.stringify(eventName)}`)
  }
}

export function addDecodedTypesToEvents(log: providers.Log): EthersEventWithDecodedTypes<TransferSentSDK | TransferBondedSDK> {
  const gateway = new RailsGatewaySDK({ network: 'mainnet'})
  const decodedEventRes = gateway.addDecodedTypesToEvents([log])

  if (decodedEventRes.length === 0) {
    throw new Error('Could not decode event')
  }

  const decodedEvent = decodedEventRes[0]
  if (typeof decodedEvent === 'undefined') {
    throw new Error('Could not decode event context')
  }

  return decodedEvent
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

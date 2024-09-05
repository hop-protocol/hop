import {
  type EthersEventWithDecodedTypesAndContext,
  type TransferSent as TransferSentSDK,
  /* type TransferPosted as TransferPostedSDK, */
  type TransferBonded as TransferBondedSDK,
  type GetTransferSentEventFilterInput,
  type PostClaimInput as PostClaimInputSDK,
  type BondInput as BondInputSDK,
  type HopStruct,
  RailsGateway
} from '@hop-protocol/v2-sdk'
import {
  type EventFilter,
  type Signer,
  Wallet,
  providers
} from 'ethers'
import { NetworkSlug } from '@hop-protocol/sdk'
import type { DecodedLogWithContext, RequiredEventFilter } from '#types/index.js'
import type { RailsPath } from './types.js'


export type TransferSent = TransferSentSDK
export type TransferPosted = TransferSentSDK
export type TransferBonded = TransferBondedSDK

// TODO: Sent -> posted
type TransferTypes = TransferSent | /* TransferPosted |*/ TransferBonded

// TODO: Get from SDK
export enum EventName {
  TransferSent = 'TransferSent',
  TransferPosted = 'TransferPosted',
  TransferBonded = 'TransferBonded'
}

// TODO: Get from SDK
export type TransferSentIndexedEvents = {
  pathId: string
  transferId: string
  to: string
}

// TODO: Get from SDK
export type TransferPostedIndexedEvents = {
  pathId: string
  transferId: string
  to: string
}

// TODO: Get from SDK
export type TransferBondedIndexedEvents = {
  pathId: string
  transferId: string
  to: string
}

// TODO: Get from SDK
export enum RailsEventName {
  TransferSent = 'TransferSent',
  TransferPosted = 'TransferPosted',
  TransferBonded = 'TransferBonded'
  // TODO: Add them all
}

export enum RailsFunctionName {
  Bond = 'bond'
}
// TODO: No chainId in input if connecting
export type PostClaimInput = Omit<PostClaimInputSDK, 'chainId'>
export type BondInput = Omit<BondInputSDK, 'chainId'>

export class RailsSDKWrapper {
  static getEventFilter<T extends string, U extends object>(eventName: T, chainId: string, indexes?: U): RequiredEventFilter {
    switch (eventName) {
      case EventName.TransferSent:
        return RailsSDKWrapper.getTransferSentEventFilter(chainId, indexes as TransferSentIndexedEvents)
      case EventName.TransferPosted:
        return RailsSDKWrapper.getTransferPostedEventFilter(chainId, indexes as TransferPostedIndexedEvents)
      case EventName.TransferBonded:
        return RailsSDKWrapper.getTransferBondedEventFilter(chainId, indexes as TransferBondedIndexedEvents)
      default:
        throw new Error(`Unknown event name: ${eventName}`)
    }
  }

  static getTransferSentEventFilter(chainId: string, indexes?: Partial<TransferSentIndexedEvents>): RequiredEventFilter {
    return RailsSDK.getTransferSentEventFilter({ chainId, indexes }) as RequiredEventFilter
  }

  static getTransferPostedEventFilter(chainId: string, indexes?: Partial<TransferPostedIndexedEvents>): RequiredEventFilter {
    return RailsSDK.getTransferPostedEventFilter({ chainId, indexes }) as RequiredEventFilter
  }

  static getTransferBondedEventFilter(chainId: string, indexes?: Partial<TransferBondedIndexedEvents>): RequiredEventFilter {
    // TODO: Correct filter
    return RailsSDK.getTransferSentEventFilter({ chainId, indexes }) as RequiredEventFilter
  }

  static addDecodedTypesAndContextToEvent(event: providers.Log, chainId: string): DecodedLogWithContext {
    const res = RailsSDK.addDecodedTypesAndContextToEvent(event, chainId)
    return {
      ...res,
      context: {
        eventName: res.context.eventName,
        chainId: res.context.chainId
      }
    }
  }

  /**
   * Transactions
   */

  static async postClaim (input: PostClaimInput): Promise<providers.TransactionResponse> {
    // TODO: rm chainId since connected
    // TODO: correct, less strict type
    return RailsSDK.postClaim({
      chainId: 1,
      pathId: input.pathId,
      transferId: input.transferId,
      to: input.to,
      amount: input.amount,
      totalSent: input.totalSent,
      attestedClaimId: input.attestedClaimId,
      attestedTotalClaims: input.attestedTotalClaims,
      nextHopsHash: input.nextHopsHash
    })
  }

  static async bond (input: BondInput): Promise<providers.TransactionResponse> {
    // TODO: rm chainId since connected
    // TODO: correct, less strict type
    return RailsSDK.bond({
      chainId: 1,
      pathId: input.pathId,
      transferId: input.transferId,
      nextHops: input.nextHops
    })
  }
}

export class RailsSDK {

  // TODO: Signer or provider or however ethers does it
  static connect (signer: Signer | providers.Provider): RailsGateway {
    return RailsSDK.getGateway()
  }

  static getTransferSentEventFilter({ chainId , indexes = {} }: GetTransferSentEventFilterInput): EventFilter {
    return RailsSDK.getGateway().getTransferSentEventFilter({ chainId, indexes })
  }

  // TODO: Correct type
  static getTransferPostedEventFilter({ chainId , indexes = {} }: any): EventFilter {
    // TODO: Correct filter
    return RailsSDK.getGateway().getTransferSentEventFilter({ chainId, indexes })
  }

  // TODO: Correct type
  static getTransferBondedEventFilter({ chainId , indexes = {} }: any): EventFilter {
    // TODO: Correct filter
    return RailsSDK.getGateway().getTransferSentEventFilter({ chainId, indexes })
  }

  // TODO: Add posted return type
  // TODO: Expect context
  // TODO expect event to be providers.Log (or some ethers type) since the method doesn't care what it is, so no any or generic needed
  static addDecodedTypesAndContextToEvent(event: any, chainId: string): EthersEventWithDecodedTypesAndContext<TransferTypes> {
    // TODO: Single method from SDK?
    // TODO: No array param or response
    const decodedEvent = RailsSDK.getGateway().addDecodedTypesToEvents([event])[0]
    // TODO: Add context from SDK
    // const decodedEventWithContext = RailsSDK.getGateway().addContextToEvent(decodedEvent, chainId)
    return decodedEvent as EthersEventWithDecodedTypesAndContext<TransferTypes>
  }

  // TODO: get from SDK
  static async isClaimed(transferId: string): Promise<boolean> {
    return true
  }

  // TODO: get from SDK
  static async isBonded(transferId: string): Promise<boolean> {
    return true
  }

  // TODO: get from SDK
  static getNextHopsHash(nextHops: HopStruct[]): string {
    return ''
  }

  // TODO: get from SDK
  static getPathId(path: RailsPath): string {
    return ''
  }

  // TODO: get from SDK
  static async isPathLive(pathId: string): Promise<boolean> {
    return true
  }

  /**
   * Transactions
   */

  static async postClaim (input: PostClaimInputSDK): Promise<providers.TransactionResponse> {
    return RailsSDK.getGateway().postClaim(input)
  }

  static async bond (input: BondInputSDK): Promise<providers.TransactionResponse> {
    return RailsSDK.getGateway().bond(input)
  }

  /**
   * Temp helper
   */

  static getGateway(): RailsGateway {
    const provider = new providers.JsonRpcProvider('https://mainnet.infura.io/v3/84842078b09946638c03157f83405213') // infura id is from ethers
    const wallet = new Wallet('0x0000000000000000000000000000000000000000000000000000000037BDDB5C', provider) // arbitrary private key
    return new RailsGateway({
      network: NetworkSlug.Mainnet,
      signer: wallet
    })
  }
}
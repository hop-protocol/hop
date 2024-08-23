import { BigNumberish } from 'ethers'
import { Event as EthersEvent } from 'ethers'

export type BaseEventContext = {
  eventName: string
  chainSlug: string
  chainId: string
  transactionHash: string
  transactionIndex: number
  logIndex: number
  blockNumber: number
}

export type ReceiptEventContext = Partial<{
  status: number;
  blockTimestamp: number
  from: string
  to: string
  value: string
  nonce: number
  gasLimit: number
  gasUsed: number
  gasPrice: string
  data: string
}>

export type EventContext = BaseEventContext & ReceiptEventContext

export interface Filter {
  address?: string | string[];
  fromBlock?: BigNumberish;
  toBlock?: BigNumberish;
  topics?: Array<string | string[]>;
}

export type EthersEventWithDecodedTypes<T> = EthersEvent & { decoded: T }
export type EthersEventWithDecodedTypesAndContext <T> = EthersEvent & { decoded: T, context: EventContext }

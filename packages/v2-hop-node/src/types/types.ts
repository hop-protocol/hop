import type {
  CallOverrides,
  EventFilter,
  providers
} from 'ethers'
import type { EthersEventWithDecodedTypes } from '@hop-protocol/sdk'

/**
 * Logs, events, and filters
 */

type LogContext = {
  eventName: string
  chainId: string
}

export type DecodedLogWithContext<T extends object = object> = EthersEventWithDecodedTypes<T> & { context: LogContext }

// Override ethers types with required fields
export type RequiredEventFilter = Required<EventFilter>
export type RequiredFilter = Required<providers.Filter>

/**
 * Transactions
 */

// Use an interface so that intellisense doesn't ignore our type definition
// https://github.com/microsoft/TypeScript/issues/31940
export interface TxOverrides extends CallOverrides {}

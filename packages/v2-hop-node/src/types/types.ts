import type {
  CallOverrides,
  Event as EthersEvent,
  EventFilter,
  providers
} from 'ethers'

/**
 * Logs, events, and filters
 */

type LogContext = {
  eventName: string
  chainId: string
}

type LogWithContext = providers.Log & { context: LogContext }
export type DecodedLogWithContext<T extends object = object> = LogWithContext & { decoded: T }

// Override ethers types with required fields
export type RequiredEventFilter = Required<EventFilter>
export type RequiredFilter = Required<providers.Filter>

export type Event = EthersEvent & {
  blockNumber?: number
}

/**
 * Transactions
 */

// Use an interface so that intellisense doesn't ignore our type definition
// https://github.com/microsoft/TypeScript/issues/31940
export interface TxOverrides extends CallOverrides {}

import type { EventFilter, providers } from 'ethers'

type LogContext = {
  eventName: string
  chainId: string
}

type LogWithContext = providers.Log & { context: LogContext }
export type DecodedLogWithContext<T extends object = object> = LogWithContext & { decoded: T }

// Override ethers types with required fields
export type RequiredEventFilter = Required<EventFilter>
export type RequiredFilter = Required<providers.Filter>

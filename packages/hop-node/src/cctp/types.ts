import type { EventFilter, providers } from 'ethers'

export type LogWithChainId = providers.Log & { chainId: string }

// Override ethers types with required fields
export type RequiredEventFilter = Required<EventFilter>
export type RequiredFilter = Required<providers.Filter>

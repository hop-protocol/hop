import type { EventFilter, providers } from 'ethers'

// TODO: From SDK (not the name typedData though)
export type LogWithChainId = providers.Log & { chainId: string } & { typedData?: any }

// Override ethers types with required fields
export type RequiredEventFilter = Required<EventFilter>
export type RequiredFilter = Required<providers.Filter>

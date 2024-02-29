import { CallOverrides, Event as EthersEvent } from 'ethers'

export type Event = EthersEvent & {
  blockNumber?: number
}

// Use an interface so that intellisense doesn't ignore our type definition
// https://github.com/microsoft/TypeScript/issues/31940
export interface TxOverrides extends CallOverrides {}
import type { StateTxContext } from '#state-machine/index.js'

export enum CCTPMessageState {
  Sent = 'sent',
  Relayed = 'relayed'
}

interface ICCTPMessageShared extends StateTxContext {
  messageNonce: number
  sourceChainId: string
  destinationChainId: string
}

export interface ISentCCTPMessage extends ICCTPMessageShared {
  message: string
}

export interface IRelayedCCTPMessage extends ICCTPMessageShared {}

export type ICCTPMessage = ISentCCTPMessage | IRelayedCCTPMessage

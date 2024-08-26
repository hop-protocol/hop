export enum CCTPMessageState {
  Sent = 'sent',
  Relayed = 'relayed'
}

interface ICCTPMessageShared {
  messageNonce: number
  sourceChainId: string
  destinationChainId: string
}

export interface ISentCCTPMessage extends ICCTPMessageShared {
  message: string
  sentTxHash: string
  sentTimestampMs: number
}

export interface IRelayedCCTPMessage extends ICCTPMessageShared {
  relayTransactionHash: string
  relayTimestampMs: number
}

export type ICCTPMessage = ISentCCTPMessage | IRelayedCCTPMessage

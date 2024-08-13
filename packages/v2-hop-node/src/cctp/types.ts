export enum MessageState {
  Sent = 'sent',
  Relayed = 'relayed'
}

interface IMessageShared {
  messageNonce: number
  sourceChainId: string
  destinationChainId: string
}

export interface ISentMessage extends IMessageShared {
  message: string
  sentTxHash: string
  sentTimestampMs: number
}

export interface IRelayedMessage extends IMessageShared {
  relayTransactionHash: string
  relayTimestampMs: number
}

export type IMessage = ISentMessage | IRelayedMessage

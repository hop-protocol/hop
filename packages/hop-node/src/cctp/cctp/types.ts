export enum MessageState {
  Sent = 'sent',
  Relayed = 'relayed'
}

export interface ISentMessage {
  messageNonce: number
  message: string
  sourceChainId: string
  destinationChainId: string
  sentTxHash: string
  sentTimestampMs: number
}

export interface IRelayedMessage {
  relayTransactionHash: string
  relayTimestampMs: number
}

export type IMessage = ISentMessage & IRelayedMessage

// TODO: I should be able to not need the string after, but that is what is used for db index so maybe i do?
export enum MessageState {
  Sent = 'sent',
  Relayed = 'relayed'
}

interface IMessageShared {
  message: string
  destinationChainId: string
}

export interface ISentMessage extends IMessageShared {
  messageNonce: number
  message: string
  sourceChainId: string
  sentTxHash: string
  sentTimestampMs: number
}

export interface IRelayedMessage extends IMessageShared {
  relayTransactionHash: string
  relayTimestampMs: number
}

export type IMessage = ISentMessage | IRelayedMessage

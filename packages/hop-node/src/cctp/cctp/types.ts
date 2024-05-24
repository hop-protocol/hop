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
  nonce: number
}

export type IMessage = ISentMessage & IRelayedMessage

import type { ReceiveMessageInput as ReceiveMessageInputSDK } from './CCTPSDKWrapper.js'

export interface ReceiveMessageInput extends ReceiveMessageInputSDK {
  destinationChainId: string
}

export type ICCTPRelayItem = ReceiveMessageInput

import type { ReceiveMessageInput as ReceiveMessageInputSDK } from '../CCTPSDKWrapper.js'

export interface ReceiveMessageInput extends ReceiveMessageInputSDK {
  destChainId: string
}

export type ICCTPRelayItem = ReceiveMessageInput

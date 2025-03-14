import type {
  ReceiveMessageInput as ReceiveMessageInputSDK,
  CCTPMethodName
} from './CCTPSDKWrapper.js'

export interface ReceiveMessageInput extends ReceiveMessageInputSDK {
  destinationChainId: string
}

export type ICCTPRelayItem = ReceiveMessageInput

export type {
  CCTPMethodName
}

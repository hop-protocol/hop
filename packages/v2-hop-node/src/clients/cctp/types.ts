import type { ReceiveMessageInput as ReceiveMessageInputSDK } from './CCTPSDKWrapper.js'
import type { RelayChainId } from '#relayer/types.js'

export interface ReceiveMessageInput extends ReceiveMessageInputSDK {
  destinationChainId: string
}

export type ICCTPRelayItem = ReceiveMessageInput & RelayChainId

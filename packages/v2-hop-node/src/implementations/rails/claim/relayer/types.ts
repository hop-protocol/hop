import type { PostClaimInput as PostClaimInputSDK } from '../../RailsSDKWrapper.js'

// There is no need to handle confirmClaim since it is propagated with the transfer
export interface PostClaimInput extends PostClaimInputSDK {}

export type IRailsClaimRelayItem = PostClaimInput

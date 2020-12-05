export const DEVERSIFI_LOGO_URL =
  'https://liquidity-network-poc.s3.amazonaws.com/deversifi.svg'
export const OFFCHAIN_LABS_LOGO_URL =
  'https://liquidity-network-poc.s3.amazonaws.com/offchain-labs.png'
export const OPTIMISM_LOGO_URL =
  'https://liquidity-network-poc.s3.amazonaws.com/optimism.svg'
export const MAINNET_LOGO_URL =
  'https://liquidity-network-poc.s3.amazonaws.com/mainnet.svg'

export enum PROPOSAL_STATUSES {
  PENDING = 'pending',
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  DEFEATED = 'defeated',
  SUCCEEDED = 'succeeded',
  QUEUED = 'queued',
  EXPIRED = 'expired',
  EXECUTED = 'executed'
}

export enum VOTE_STATUS {
  FOR = 'For',
  AGAINST = 'Against'
}

export const DEVERSIFI_LOGO_URL =
  'https://liquidity-network-poc.s3.amazonaws.com/deversifi.svg'
export const OFFCHAIN_LABS_LOGO_URL =
  'https://liquidity-network-poc.s3.amazonaws.com/offchain-labs.png'
export const OPTIMISM_LOGO_URL =
  'https://liquidity-network-poc.s3.amazonaws.com/optimism.svg'
export const MAINNET_LOGO_URL =
  'https://liquidity-network-poc.s3.amazonaws.com/mainnet.svg'

export const PROPOSAL_STATUSES: any = {
  PENDING: 'pending',
  ACTIVE: 'active',
  CANCELLED: 'cancelled',
  DEFEATED: 'defeated',
  SUCCEEDED: 'succeeded',
  QUEUED: 'queued',
  EXPIRED: 'expired',
  EXECUTED: 'executed'
}

export const PROPOSAL_STATUS_COLORS: any = {
  PENDING: {
    textColor: '#2172E5',
    bgColor: '#CCD5E0'
  },
  ACTIVE: {
    textColor: '#2172E5',
    bgColor: '#CCD5E0'
  },
  CANCELLED: {
    textColor: '#2172E5', // TODO: Should be text
    bgColor: '#CCD5E0'
  },
  DEFEATED: {
    textColor: '#FF6871',
    bgColor: '#E4D6D6'
  },
  SUCCEEDED: {
    textColor: '#27AE60',
    bgColor: '#DAE5DD'
  },
  QUEUED: {
    textColor: '#2172E5', // TODO: Should be text
    bgColor: '#CCD5E0'
  },
  EXPIRED: {
    textColor: '#2172E5', // TODO: Should be text
    bgColor: '#CCD5E0'
  },
  EXECUTED: {
    textColor: '#27AE60',
    bgColor: '#E5DEDA'
  }
}

export enum VOTE_STATUS {
  FOR = 'For',
  AGAINST = 'Against'
}

export const AVERAGE_BLOCK_TIME_IN_SECS = 14
export const PROPOSAL_LENGTH_IN_BLOCKS = 40_320
export const PROPOSAL_LENGTH_IN_SECS =
  AVERAGE_BLOCK_TIME_IN_SECS * PROPOSAL_LENGTH_IN_BLOCKS

export const NetworkContextName = 'NETWORK'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const HOP_ADDRESS = '0x752Ebd504E4faC89397448b434aa3aA4AEcD0B5E'
export const GOVERNANCE_ADDRESS = '0xb00527B76110D2eBC5fd050C5EfEF3a32D4699Dc'
export const TIMELOCK_ADDRESS = '0x92E5A4B202F57B3634d6352fBAbBA9Cf2908a14A'
export const COMMON_CONTRACT_NAMES: { [address: string]: string } = {
  [HOP_ADDRESS]: 'HOP',
  [GOVERNANCE_ADDRESS]: 'Governance',
  [TIMELOCK_ADDRESS]: 'Timelock'
}

export declare enum NetworkId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GOERLI = 5,
  KOVAN = 42
}

export const ETHERSCAN_PREFIXES: { [networkId in NetworkId]: string } = {
  1: '',
  3: 'ropsten.',
  4: 'rinkeby.',
  5: 'goerli.',
  42: 'kovan.'
}

export const STAKING_GENESIS = 1600387200 // TODO: Update with real data
export const REWARDS_DURATION_DAYS = 60

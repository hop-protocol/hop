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

export const AVERAGE_BLOCK_TIME_IN_SECS = 14
export const PROPOSAL_LENGTH_IN_BLOCKS = 40_320
export const PROPOSAL_LENGTH_IN_SECS = AVERAGE_BLOCK_TIME_IN_SECS * PROPOSAL_LENGTH_IN_BLOCKS

export const NetworkContextName = 'NETWORK'

export const HOP_ADDRESS = '0x12345601Ed33f7B10D1B67f79CCd84152c5F9397'
export const GOVERNANCE_ADDRESS = '0x12345601Ed33f7B10D1B67f79CCd84152c5F9397'
export const TIMELOCK_ADDRESS = '0x12345601Ed33f7B10D1B67f79CCd84152c5F9397'
export const COMMON_CONTRACT_NAMES: { [address: string]: string } = {
  [HOP_ADDRESS]: 'UNI',
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
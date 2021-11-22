export const PROPOSAL_STATUSES: any = {
  PENDING: 'pending',
  ACTIVE: 'active',
  CANCELLED: 'cancelled',
  DEFEATED: 'defeated',
  SUCCEEDED: 'succeeded',
  QUEUED: 'queued',
  EXPIRED: 'expired',
  EXECUTED: 'executed',
}

export enum VOTE_STATUS {
  FOR = 'For',
  AGAINST = 'Against',
}

const AVERAGE_BLOCK_TIME_IN_SECS = 14
const PROPOSAL_LENGTH_IN_BLOCKS = 40_320
export const PROPOSAL_LENGTH_IN_SECS = AVERAGE_BLOCK_TIME_IN_SECS * PROPOSAL_LENGTH_IN_BLOCKS

const HOP_ADDRESS = '0x752Ebd504E4faC89397448b434aa3aA4AEcD0B5E'
const GOVERNANCE_ADDRESS = '0xb00527B76110D2eBC5fd050C5EfEF3a32D4699Dc'
const TIMELOCK_ADDRESS = '0x92E5A4B202F57B3634d6352fBAbBA9Cf2908a14A'
export const COMMON_CONTRACT_NAMES: { [address: string]: string } = {
  [HOP_ADDRESS]: 'HOP',
  [GOVERNANCE_ADDRESS]: 'Governance',
  [TIMELOCK_ADDRESS]: 'Timelock',
}

export declare enum NetworkId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GOERLI = 5,
  KOVAN = 42,
}

export const ETHERSCAN_PREFIXES: { [networkId in NetworkId]: string } = {
  1: '',
  3: 'ropsten.',
  4: 'rinkeby.',
  5: 'goerli.',
  42: 'kovan.',
}

export const STAKING_GENESIS = 1600387200 // TODO: Update with real data
export const REWARDS_DURATION_DAYS = 60

export const L1_NETWORK = 'ethereum'

export const careersUrl = 'https://hop.exchange/careers'
export const docsUrl = 'https://docs.hop.exchange/'
export const faqUrl = 'https://help.hop.exchange/hc/en-us'
export const discordUrl = 'https://discord.gg/PwCF88emV4'
export const githubUrl = 'https://github.com/hop-protocol'
export const mediumUrl = 'https://medium.com/hop-protocol'
export const twitterUrl = 'https://twitter.com/HopProtocol'

export enum EventNames {
  TransferSent = 'TransferSent',
  TransferSentToL2 = 'TransferSentToL2',
}

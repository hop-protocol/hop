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
export const UINT256: string =
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

export const MAINNET = 'mainnet'
export const KOVAN = 'kovan'
export const L1_NETWORK = 'ethereum'
export const ARBITRUM = 'arbitrum'
export const OPTIMISM = 'optimism'
export const XDAI = 'xdai'
export const POLYGON = 'polygon'
export const ARBITRUM_MESSENGER_ID =
  '0x9186606d55c571b43a756333453d90ab5653c483deb4980cda697bfa36fba5de'
export const OPTIMISM_MESSENGER_ID =
  '0x09d0f27659ee556a8134fa56941e42400e672aecc2d4cfc61cdb0fcea4590e05'

export const careersUrl = 'https://hop.exchange/careers'
export const docsUrl = 'https://docs.hop.exchange/'
export const faqUrl = 'https://help.hop.exchange/hc/en-us'
export const discordUrl = 'https://discord.gg/PwCF88emV4'
export const githubUrl = 'https://github.com/hop-protocol'
export const mediumUrl = 'https://medium.com/hop-protocol'
export const twitterUrl = 'https://twitter.com/HopProtocol'

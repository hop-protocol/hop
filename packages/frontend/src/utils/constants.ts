import { ChainSlug, Token } from '@hop-protocol/sdk'
import Network from 'src/models/Network'

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

export const L1_NETWORK = ChainSlug.Ethereum

export const careersUrl = 'https://hop.exchange/careers'
export const docsUrl = 'https://docs.hop.exchange/v/developer-docs/'
export const faqUrl = 'https://docs.hop.exchange/basics/faq'
export const discordUrl = 'https://discord.gg/PwCF88emV4'
export const githubUrl = 'https://github.com/hop-protocol'
export const mediumUrl = 'https://medium.com/hop-protocol'
export const twitterUrl = 'https://twitter.com/HopProtocol'
export const forumUrl = 'https://forum.hop.exchange/'

export enum EventNames {
  TransferSent = 'TransferSent',
  TransferSentToL2 = 'TransferSentToL2',
}

export enum WalletName {
  GnosisSafe = 'Gnosis Safe',
}

export interface NetworkTokenEntity {
  network: Network
  token: Token
  amount: string
}

export const RelayableChains: string[] = [
  ChainSlug.Arbitrum,
  ChainSlug.Nova
]

export const stableCoins = new Set(['USDC', 'USDT', 'DAI', 'sUSD'])

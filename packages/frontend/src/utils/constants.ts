import { ChainSlug, Token } from '@hop-protocol/sdk'
import { networks } from '@hop-protocol/core/networks'
import { tokens } from '@hop-protocol/core/metadata/tokens'
import Network from 'src/models/Network'

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

const relayableChainsSet = new Set(<string[]>[])
for (const network in networks) {
  const networkObj = networks[network]
  for (const chain in networkObj) {
    const chainObj = networkObj[chain]
    if (chainObj?.isRelayable) {
      relayableChainsSet.add(chain)
    }
  }
}

export const RelayableChains = Array.from(relayableChainsSet)

export const stableCoins = new Set(<string[]>[])
for (const tokenSymbol in tokens) {
  const tokenObj = tokens[tokenSymbol]
  if (tokenObj?.isStablecoin) {
    stableCoins.add(tokenSymbol)
  }
}

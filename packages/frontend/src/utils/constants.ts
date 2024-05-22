import Network from '#models/Network.js'
import { ChainSlug, Token } from '@hop-protocol/sdk'
import { getNetworks } from '@hop-protocol/sdk'
import { getTokens } from '@hop-protocol/sdk'

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
for (const network of getNetworks()) {
  for (const chain of Object.values(network.chains)) {
    if (chain.isManualRelayOnL2) {
      relayableChainsSet.add(chain.slug)
    }
  }
}

export const RelayableChains = Array.from(relayableChainsSet)

export const stableCoins = new Set(<string[]>[])
for (const token of getTokens()) {
  if (token.isStableCoin) {
    stableCoins.add(token.symbol)
  }
}

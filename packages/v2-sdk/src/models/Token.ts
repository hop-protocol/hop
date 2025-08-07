import { Address } from './Address.js'
import type { TokenConfig } from '#config/tokens/types.js'
import { tokenConfigs } from '../config/tokens/tokens.js'

export type Tokenish = Token | TokenConfig | string

export class Token {
  readonly symbol: string
  readonly name: string
  readonly decimals: number
  readonly image: string
  readonly coingeckoId: string
  readonly isStableCoin: boolean
  readonly addresses: { [key: string]: Address } = {}

  constructor(props: TokenConfig) {
    this.symbol = props.symbol
    this.name = props.name
    this.decimals = props.decimals ?? 18
    this.image = props.image
    this.coingeckoId = props.coingeckoId
    this.isStableCoin = props.isStableCoin
    this.addresses = Object.fromEntries( // object of chainIds to Addresses
      Object.entries(props.addresses).map(([chainId, addressString]) => [
        chainId,
        Address.getAddress(addressString)
      ])
    )
  }

  static getToken(token: Tokenish): Token {
    if (token instanceof Token) {
      return token
    }
    if (typeof token === 'string') {
      const tokenConfig = tokenConfigs[token]
      if (!tokenConfig) {
        throw new Error(`Token with symbol "${token}" not found`)
      }
      return new Token(tokenConfig)
    }
    return new Token(token)
  }

  static getTokens(): Token[] {
    return Object.values(tokenConfigs).map(tokenConfig => new Token(tokenConfig))
  }

  static isValidTokenSymbol(symbol: string): boolean {
    return tokenConfigs[symbol] !== undefined
  }

  eq(otherToken: Token): boolean {
    return otherToken.symbol === this.symbol
  }
}

export const getToken = Token.getToken
export const getTokens = Token.getTokens
export const isValidTokenSymbol = Token.isValidTokenSymbol

export interface Token {
  symbol: string
  name: string
  decimals: number
}

export interface Tokens {
  [key: string]: Token
}

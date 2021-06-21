import Token from './Token'

class TokenAmount {
  readonly token: Token
  readonly amount: string

  constructor (token: Token, amount: string) {
    this.token = token
    this.amount = amount
  }
}

export default TokenAmount

import { BigNumber, utils as ethersUtils } from 'ethers'
import Token from 'src/models/Token'

class TokenAmount {
  readonly amountRaw: BigNumber
  readonly token: Token

  constructor(amount: any, token: Token) {
    this.amountRaw = BigNumber.from(amount)
    this.token = token
  }

  toString() {
    return this.display()
  }

  raw(): string {
    return this.amountRaw.toString()
  }

  amount(): string {
    return ethersUtils.parseUnits(this.raw(), this.token.decimals).toString()
  }

  display(): string {
    return `${this.amount} ${this.token.symbol}`
  }
}

export default TokenAmount

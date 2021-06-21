import Route from './Route'
import TokenAmount from './TokenAmount'

class Transfer {
  readonly route: Route
  readonly tokenAmount: TokenAmount

  constructor (route: Route, tokenAmount: TokenAmount) {
    this.route = route
    this.tokenAmount = tokenAmount
  }
}

export default Transfer

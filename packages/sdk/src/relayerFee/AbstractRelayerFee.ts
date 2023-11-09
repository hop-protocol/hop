export abstract class AbstractRelayerFee {
  readonly network: string
  readonly chain: string
  readonly token: string

  constructor (network: string, chain: string, token: string) {
    this.network = network
    this.chain = chain
    this.token = token
  }
}

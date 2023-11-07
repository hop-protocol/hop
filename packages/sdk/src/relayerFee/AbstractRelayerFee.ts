export abstract class AbstractRelayerFee {
  private readonly network: string
  private readonly chain: string
  private readonly token: string

  constructor (network: string, chain: string, token: string) {
    this.network = network
    this.chain = chain
    this.token = token
  }
}

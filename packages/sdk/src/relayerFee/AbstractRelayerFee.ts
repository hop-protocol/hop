import { BigNumber } from 'ethers'

export abstract class AbstractRelayerFee {
  readonly network: string
  readonly chain: string
  readonly token: string
  readonly customRelayerFee: BigNumber

  constructor (network: string, chain: string, token: string, customRelayerFee?: string) {
    this.network = network
    this.chain = chain
    this.token = token
    this.customRelayerFee = BigNumber.from(customRelayerFee ?? 0)
  }
}

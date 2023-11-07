import { BigNumber } from 'ethers'

export abstract class AbstractRelayerFee {
  readonly network: string
  readonly chain: string
  readonly token: string
  readonly configRelayerFeeWei: BigNumber

  constructor (network: string, chain: string, token: string, configRelayerFeeWei?: string) {
    this.network = network
    this.chain = chain
    this.token = token
    this.configRelayerFeeWei = configRelayerFeeWei ? BigNumber.from(configRelayerFeeWei) : BigNumber.from(0)
  }
}

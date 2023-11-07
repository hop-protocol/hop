import { AbstractRelayerFee } from './AbstractRelayerFee'
import { BigNumber } from 'ethers'
import { IRelayerFee } from './IRelayerFee'

export class ArbitrumRelayerFee extends AbstractRelayerFee implements IRelayerFee {
  async getRelayCost (): Promise<BigNumber> {
    return BigNumber.from(0)
  }
}

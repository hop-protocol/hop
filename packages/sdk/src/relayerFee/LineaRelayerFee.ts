import { AbstractRelayerFee } from './AbstractRelayerFee'
import { BigNumber } from 'ethers'
import { IRelayerFee } from './IRelayerFee'
export class LineaRelayerFee extends AbstractRelayerFee implements IRelayerFee {
  async getRelayCost (): Promise<BigNumber> {
    return this.configRelayerFeeWei
  }
}

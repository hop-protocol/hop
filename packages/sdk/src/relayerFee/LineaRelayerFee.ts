import { AbstractRelayerFee } from './AbstractRelayerFee'
import { BigNumber } from 'ethers'
import { IRelayerFee } from './IRelayerFee'

export class LineaRelayerFee extends AbstractRelayerFee implements IRelayerFee {
  getRelayCost = async (): Promise<BigNumber> => {
    return BigNumber.from(0)
  }
}

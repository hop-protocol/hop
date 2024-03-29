import { AbstractRelayerFee } from './AbstractRelayerFee.js'
import { BigNumber } from 'ethers'
import { IRelayerFee } from './IRelayerFee.js'

export class LineaRelayerFee extends AbstractRelayerFee implements IRelayerFee {
  getRelayCost = async (): Promise<BigNumber> => {
    return BigNumber.from(0)
  }
}

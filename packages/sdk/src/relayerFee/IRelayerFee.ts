import { BigNumber } from 'ethers'

export interface IRelayerFee {
  getRelayCost(): Promise<BigNumber>
}

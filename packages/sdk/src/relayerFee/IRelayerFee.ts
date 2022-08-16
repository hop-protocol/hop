import { BigNumber } from 'ethers'

export interface IRelayerFee {
  getRelayCost(chain: string): Promise<BigNumber>
}

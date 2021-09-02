import ContractBase from './ContractBase'
import { BigNumber } from 'ethers'

export default class L2Amm extends ContractBase {
  async calculateHTokensOut (amountIn: BigNumber):Promise<BigNumber> {
    const hTokenAmount = await this.contract.calculateSwap(
      0,
      1,
      amountIn
    )
    return hTokenAmount
  }
}

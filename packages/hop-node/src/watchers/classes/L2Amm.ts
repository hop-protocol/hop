import ContractBase from './ContractBase'

import { TokenIndex } from 'src/constants'

export default class L2Amm extends ContractBase {
  calculateToHTokensAmount = async (amountIn: bigint): Promise<bigint> => {
    const hTokenAmount = await this.contract.calculateSwap(
      TokenIndex.CanonicalToken,
      TokenIndex.HopBridgeToken,
      amountIn
    )
    return hTokenAmount
  }

  calculateFromHTokensAmount = async (amountIn: bigint): Promise<bigint> => {
    const amountOut = await this.contract.calculateSwap(
      TokenIndex.HopBridgeToken,
      TokenIndex.CanonicalToken,
      amountIn
    )
    return amountOut
  }

  swap = async (fromTokenIndex: number, toTokenIndex: number, amountIn: bigint, minAmountOut: bigint = 0n, deadline: bigint = this.defaultDeadline()): Promise<bigint> => {
    const txOverrides = await this.txOverrides()
    return this.contract.swap(
      fromTokenIndex,
      toTokenIndex,
      amountIn,
      minAmountOut,
      deadline,
      txOverrides
    )
  }

  defaultDeadline () {
    return BigInt(Math.floor((Date.now() / 1000) + 300))
  }
}

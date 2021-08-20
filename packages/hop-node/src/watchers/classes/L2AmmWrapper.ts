import ContractBase from './ContractBase'
import rateLimitRetry from 'src/decorators/rateLimitRetry'
import { BigNumber, providers } from 'ethers'
import { Chain } from 'src/constants'
import { Hop } from '@hop-protocol/sdk'
import { config as globalConfig } from 'src/config'
import { isL1ChainId } from 'src/utils'

export default class L2AmmWrapper extends ContractBase {
  @rateLimitRetry
  async decodeSwapAndSendData (data: string): Promise<any> {
    let attemptSwap = false
    const decoded = await this.contract.interface.decodeFunctionData(
      'swapAndSend',
      data
    )
    const chainId = Number(decoded.chainId.toString())

    if (!isL1ChainId(chainId)) {
      // L2 to L2 transfers have destination swap parameters set
      if (Number(decoded.destinationDeadline.toString()) > 0) {
        attemptSwap = true
      }
    }

    return {
      chainId,
      attemptSwap
    }
  }

  async swapAndSend (
    destinationChainId: number,
    amount: BigNumber,
    token: string
  ): Promise<providers.TransactionResponse> {
    const sdk = new Hop(globalConfig.network)
    const recipient = await this.contract.signer.getAddress()
    const bridge = sdk.bridge(token)
    const bonderFee = await bridge.getBonderFee(
      amount,
      this.chainSlug,
      this.chainIdToSlug(destinationChainId)
    )

    const deadline = bridge.defaultDeadlineSeconds
    const destinationDeadline = bridge.defaultDeadlineSeconds
    const { amountOut } = await bridge.getSendData(amount, this.chainSlug, this.chainIdToSlug(destinationChainId))
    const slippageTolerance = 0.1
    const slippageToleranceBps = slippageTolerance * 100
    const minBps = Math.ceil(10000 - slippageToleranceBps)
    const amountOutMin = amountOut.mul(minBps).div(10000)
    const destinationAmountOutMin = amountOutMin
    const isNativeToken = token === 'MATIC' && this.chainSlug === Chain.Polygon

    return this.contract.swapAndSend(
      destinationChainId,
      recipient,
      amount,
      bonderFee,
      amountOutMin,
      deadline,
      destinationAmountOutMin,
      destinationDeadline,
      {
        ...(await this.txOverrides()),
        value: isNativeToken ? amount : undefined
      }
    )
  }
}

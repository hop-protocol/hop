import ContractBase from './ContractBase.js'
import { BigNumber, utils } from 'ethers'
import { ChainSlug, Hop } from '@hop-protocol/sdk'
import { config as globalConfig } from '#config/index.js'
import { isL1ChainId } from '#utils/isL1ChainId.js'
import { isNativeToken } from '#utils/isNativeToken.js'
import type { TxOverrides } from '#types/index.js'
import type { providers } from 'ethers'
import { getToken, TokenSymbol } from '@hop-protocol/sdk'

export default class L2AmmWrapper extends ContractBase {
  decodeSwapAndSendData (data: string): any {
    let attemptSwap = false
    const decoded = this.contract.interface.decodeFunctionData(
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

  swapAndSend = async (
    destinationChainId: number,
    amount: BigNumber,
    token: string,
    recipient: string
  ): Promise<providers.TransactionResponse> => {
    const sdk = new Hop(globalConfig.network)
    const bridge = sdk.bridge(token)

    const deadline = bridge.defaultDeadlineSeconds
    let destinationDeadline = bridge.defaultDeadlineSeconds
    const destinationChain = this.getSlugFromChainId(destinationChainId)
    const { amountOut, totalFee } = await bridge.getSendData(amount, this.chainSlug, destinationChain)
    const slippageTolerance = 0.1
    const slippageToleranceBps = slippageTolerance * 100
    const minBps = Math.ceil(10000 - slippageToleranceBps)
    const amountOutMin = amountOut.mul(minBps).div(10000)
    let destinationAmountOutMin = amountOutMin
    const isNativeTokenSend = isNativeToken(this.chainId.toString(), token)
    const tokenDecimals = getToken(token as TokenSymbol)?.decimals
    if (destinationChain === ChainSlug.Ethereum) {
      destinationDeadline = 0
      destinationAmountOutMin = BigNumber.from(0)
    }

    if (totalFee.gt(amount)) {
      throw new Error(`amount must be greater than bonder fee. Estimated bonder fee is ${utils.formatUnits(totalFee, tokenDecimals)}`)
    }

    const overrides: TxOverrides = {
      ...(await this.txOverrides()),
      value: isNativeTokenSend ? amount : undefined
    }

    return this.contract.swapAndSend(
      destinationChainId,
      recipient,
      amount,
      totalFee,
      amountOutMin,
      deadline,
      destinationAmountOutMin,
      destinationDeadline,
      overrides
    )
  }
}

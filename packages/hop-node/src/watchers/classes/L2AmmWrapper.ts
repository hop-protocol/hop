import ContractBase from './ContractBase.js'
import { getTokenMetadata } from '@hop-protocol/hop-node-core/utils'
import { isL1ChainId } from '@hop-protocol/hop-node-core/utils'
import { BigNumber, providers } from 'ethers'
import { Chain } from '@hop-protocol/hop-node-core/constants'
import { Hop } from '@hop-protocol/sdk'
import { TxOverrides } from '@hop-protocol/hop-node-core/types'
import { formatUnits } from 'ethers/lib/utils.js'
import { config as globalConfig } from '#config/index.js'
import { isNativeToken } from '@hop-protocol/hop-node-core/utils'

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
    const destinationChain = this.chainIdToSlug(destinationChainId)
    const { amountOut, totalFee } = await bridge.getSendData(amount, this.chainSlug, destinationChain)
    const slippageTolerance = 0.1
    const slippageToleranceBps = slippageTolerance * 100
    const minBps = Math.ceil(10000 - slippageToleranceBps)
    const amountOutMin = amountOut.mul(minBps).div(10000)
    let destinationAmountOutMin = amountOutMin
    const isNativeTokenSend = isNativeToken(this.chainSlug, token)
    const tokenDecimals = getTokenMetadata(token)?.decimals
    if (destinationChain === Chain.Ethereum) {
      destinationDeadline = 0
      destinationAmountOutMin = BigNumber.from(0)
    }

    if (totalFee.gt(amount)) {
      throw new Error(`amount must be greater than bonder fee. Estimated bonder fee is ${formatUnits(totalFee, tokenDecimals)}`)
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

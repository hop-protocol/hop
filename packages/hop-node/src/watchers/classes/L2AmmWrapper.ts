import ContractBase from './ContractBase'
import getTokenMetadata from 'src/utils/getTokenMetadata'
import isL1ChainId from 'src/utils/isL1ChainId'
import { BigNumber, providers } from 'ethers'
import { Chain } from 'src/constants'
import { Hop } from '@hop-protocol/sdk'
import { formatUnits } from 'ethers/lib/utils'
import { config as globalConfig } from 'src/config'

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

  async swapAndSend (
    destinationChainId: number,
    amount: BigNumber,
    token: string
  ): Promise<providers.TransactionResponse> {
    const sdk = new Hop(globalConfig.network)
    const recipient = await this.contract.signer.getAddress()
    const bridge = sdk.bridge(token)
    let bonderFee = await bridge.getBonderFee(
      amount,
      this.chainSlug,
      this.chainIdToSlug(destinationChainId)
    )

    const deadline = bridge.defaultDeadlineSeconds
    let destinationDeadline = bridge.defaultDeadlineSeconds
    const destinationChain = this.chainIdToSlug(destinationChainId)
    const { amountOut, destinationTxFee } = await bridge.getSendData(amount, this.chainSlug, destinationChain)
    const slippageTolerance = 0.1
    const slippageToleranceBps = slippageTolerance * 100
    const minBps = Math.ceil(10000 - slippageToleranceBps)
    const amountOutMin = amountOut.mul(minBps).div(10000)
    let destinationAmountOutMin = amountOutMin
    const isNativeToken = token === 'MATIC' && this.chainSlug === Chain.Polygon
    const tokenDecimals = getTokenMetadata(token)?.decimals
    bonderFee = bonderFee.add(destinationTxFee)
    if (destinationChain === Chain.Ethereum) {
      destinationDeadline = 0
      destinationAmountOutMin = BigNumber.from(0)
    }

    if (bonderFee.gt(amount)) {
      throw new Error(`amount must be greater than bonder fee. Estimated bonder fee is ${formatUnits(bonderFee, tokenDecimals)}`)
    }

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

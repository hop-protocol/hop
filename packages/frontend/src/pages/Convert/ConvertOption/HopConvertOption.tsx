import React, { ReactNode } from 'react'
import { Signer, BigNumber, BigNumberish } from 'ethers'
import { Hop, HopBridge, Token, TokenSymbol } from '@hop-protocol/sdk'
import Chain from 'src/models/Chain'
import ConvertOption, { SendData } from './ConvertOption'
import { toTokenDisplay, getBonderFeeWithId } from 'src/utils'
import { DetailRow, FeeDetails } from 'src/components/InfoTooltip'
import { getConvertedFees } from 'src/hooks/useFeeConversions'

class HopConvertOption extends ConvertOption {
  readonly name: string
  readonly slug: string
  readonly path: string

  constructor() {
    super()

    this.name = 'Hop Bridge'
    this.slug = 'hop-bridge'
    this.path = '/hop'
  }

  async convert(
    sdk: Hop,
    signer: Signer,
    sourceChain: Chain,
    destinationChain: Chain,
    isConvertingToHToken: boolean,
    l1TokenSymbol: TokenSymbol,
    amountIn: BigNumberish,
    amountOutMin: BigNumberish,
    deadline: number,
    bonderFee?: BigNumberish
  ) {
    const bridge = sdk.bridge(l1TokenSymbol).connect(signer as Signer)
    if (bonderFee) {
      bonderFee = getBonderFeeWithId(BigNumber.from(bonderFee))
    }

    if (sourceChain.isLayer1) {
      bonderFee = BigNumber.from(0)
    }

    return bridge.sendHToken(amountIn, sourceChain.slug, destinationChain.slug, {
      bonderFee,
    })
  }

  async getSendData(
    sdk: Hop,
    sourceChain: Chain | undefined,
    destinationChain: Chain | undefined,
    isConvertingToHToken: boolean,
    l1TokenSymbol: TokenSymbol | undefined,
    amountIn: BigNumberish | undefined
  ): Promise<SendData> {
    if (!(l1TokenSymbol && sourceChain && destinationChain && amountIn)) {
      return {
        amountOut: undefined,
        details: [],
      }
    }

    amountIn = BigNumber.from(amountIn)
    const bridge = sdk.bridge(l1TokenSymbol)
    const token = sourceChain?.isLayer1
      ? bridge.getCanonicalToken(sourceChain?.slug)
      : bridge.getL2HopToken(sourceChain?.slug)

    if (!token) {
      throw new Error('token is required')
    }

    const isHTokenSend = true
    const { totalFee, adjustedBonderFee, adjustedDestinationTxFee } = await bridge.getSendData(
      amountIn,
      sourceChain.slug,
      destinationChain.slug,
      isHTokenSend
    )
    const availableLiquidity = await bridge.getFrontendAvailableLiquidity(
      sourceChain.slug,
      destinationChain.slug
    )

    let estimatedReceived = amountIn
    let warning

    if (estimatedReceived && totalFee?.gt(estimatedReceived)) {
      warning = 'Bonder fee greater than estimated received'
    }

    if (!sourceChain?.isLayer1 && amountIn.gt(availableLiquidity)) {
      const formattedAmount = toTokenDisplay(availableLiquidity, token?.decimals)
      warning = `Insufficient liquidity. There is ${formattedAmount} ${l1TokenSymbol} available on ${destinationChain.name}.`
    }

    if (amountIn.gte(totalFee)) {
      estimatedReceived = amountIn.sub(totalFee)
    } else {
      warning = 'Amount must be greater than the fee'
    }

    if (bridge.signer) {
      const balance = await token?.balanceOf()
      const enoughBalance = amountIn.lte(balance)
      if (!enoughBalance) {
        warning = 'Insufficient funds'
      }
    }

    const l1Token = bridge.getL1Token()
    const details = this.getDetails(
      totalFee,
      adjustedDestinationTxFee,
      adjustedBonderFee,
      estimatedReceived,
      l1Token
    )

    return {
      amountOut: amountIn,
      details,
      warning,
      bonderFee: totalFee,
    }
  }

  async getTargetAddress(
    sdk: Hop,
    l1TokenSymbol?: TokenSymbol,
    sourceChain?: Chain
  ): Promise<string> {
    if (!l1TokenSymbol) {
      throw new Error('Token symbol is required to get target address')
    }

    if (!sourceChain) {
      throw new Error('sourceChain is required to get target address')
    }

    const bridge = sdk.bridge(l1TokenSymbol)
    if (sourceChain.isLayer1) {
      const l1Bridge = await bridge.getL1Bridge()
      return l1Bridge.address
    } else {
      const l2Bridge = await bridge.getL2Bridge(sourceChain.slug)
      return l2Bridge.address
    }
  }

  async sourceToken(
    isConvertingToHToken: boolean,
    network?: Chain,
    bridge?: HopBridge
  ): Promise<Token | undefined> {
    if (!bridge || !network) return

    if (isConvertingToHToken) {
      return bridge.getL1Token()
    } else {
      return bridge.getL2HopToken(network.slug)
    }
  }

  async destToken(
    isConvertingToHToken: boolean,
    network?: Chain,
    bridge?: HopBridge
  ): Promise<Token | undefined> {
    if (!bridge || !network) return

    if (isConvertingToHToken) {
      return bridge.getL2HopToken(network.slug)
    } else {
      return bridge.getL1Token()
    }
  }

  private getDetails(
    totalFee: BigNumber,
    adjustedDestinationTxFee: BigNumber,
    adjustedBonderFee: BigNumber,
    estimatedReceived: BigNumber,
    token?: Token
  ): ReactNode {
    if (!token) return <></>

    const {
      destinationTxFeeDisplay,
      bonderFeeDisplay,
      totalBonderFeeDisplay,
      estimatedReceivedDisplay,
    } = getConvertedFees(adjustedDestinationTxFee, adjustedBonderFee, estimatedReceived, token)

    return (
      <>
        {totalFee.gt(0) && (
          <DetailRow
            title={'Fees'}
            tooltip={
              <FeeDetails bonderFee={bonderFeeDisplay} destinationTxFee={destinationTxFeeDisplay} />
            }
            value={totalBonderFeeDisplay}
            large
          />
        )}
        <DetailRow
          title="Estimated Received"
          tooltip="The estimated amount you will receive after fees"
          value={estimatedReceivedDisplay}
          large
          bold
        />
      </>
    )
  }
}

export default HopConvertOption

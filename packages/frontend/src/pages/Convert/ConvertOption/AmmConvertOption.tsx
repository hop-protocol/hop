import React, { ReactNode } from 'react'
import { Hop, HopBridge, Token, TokenSymbol } from '@hop-protocol/sdk'
import { Signer, BigNumber, BigNumberish } from 'ethers'
import Chain from 'src/models/Chain'
import { commafy, toTokenDisplay } from 'src/utils'
import ConvertOption, { SendData } from './ConvertOption'
import { AmmDetails, DetailRow } from 'src/components/InfoTooltip'

class AmmConvertOption extends ConvertOption {
  readonly name: string
  readonly slug: string
  readonly path: string

  constructor() {
    super()

    this.name = 'AMM'
    this.slug = 'amm'
    this.path = '/amm'
  }

  async getTargetAddress(
    sdk: Hop,
    l1TokenSymbol?: TokenSymbol,
    sourceChain?: Chain
  ): Promise<string> {
    if (!l1TokenSymbol) {
      throw new Error('Token is required to get target address')
    }

    if (!sourceChain) {
      throw new Error('sourceChain is required to get target address')
    }

    const bridge = sdk.bridge(l1TokenSymbol)
    const amm = bridge.getAmm(sourceChain.slug)
    const swap = await amm.getSaddleSwap()
    return swap.address
  }

  async getSendData(
    sdk: Hop,
    sourceChain: Chain | undefined,
    destinationChain: Chain | undefined,
    isConvertingToHToken: boolean,
    l1TokenSymbol?: TokenSymbol,
    amountIn?: BigNumberish
  ): Promise<SendData> {
    if (!l1TokenSymbol || !sourceChain) {
      return {
        amountOut: undefined,
        details: [],
      }
    }

    const bridge = await sdk.bridge(l1TokenSymbol)

    const amm = bridge.getAmm(sourceChain.slug)
    let amountOut: BigNumber | undefined
    if (amountIn) {
      if (isConvertingToHToken) {
        amountOut = await amm.calculateToHToken(amountIn)
      } else {
        amountOut = await amm.calculateFromHToken(amountIn)
      }
    }

    const details = await this.getDetails(
      sdk,
      amountIn,
      amountOut,
      sourceChain,
      destinationChain,
      isConvertingToHToken,
      bridge.getTokenSymbol()
    )

    return {
      amountOut,
      details,
    }
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
    const bridge = await sdk.bridge(l1TokenSymbol).connect(signer as Signer)

    return bridge.execSaddleSwap(
      sourceChain.slug,
      isConvertingToHToken,
      amountIn,
      amountOutMin,
      deadline
    )
  }

  async sourceToken(
    isConvertingToHToken: boolean,
    network?: Chain,
    bridge?: HopBridge
  ): Promise<Token | undefined> {
    if (!bridge || !network) return

    if (isConvertingToHToken) {
      let token = bridge.getCanonicalToken(network.slug)
      if (token?.isNativeToken) {
        token = token.getWrappedToken()
      }
      return token
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
      let token = bridge.getCanonicalToken(network.slug)
      if (token?.isNativeToken) {
        token = token.getWrappedToken()
      }
      return token
    }
  }

  private async getDetails(
    sdk: Hop,
    amountIn: BigNumberish | undefined,
    amountOut: BigNumber | undefined,
    sourceChain: Chain | undefined,
    destinationChain: Chain | undefined,
    isConvertingToHToken: boolean,
    l1TokenSymbol: TokenSymbol
  ): Promise<ReactNode> {
    let rateDisplay = '-'
    let slippageToleranceDisplay = '-'
    let priceImpactDisplay = '-'
    let amountOutMinDisplay = '-'
    let feeDisplay = '-'

    // ToDo: Enable configurable slippage tolerance
    const slippageTolerance = 1

    if (!amountIn || !sourceChain || !destinationChain || !slippageTolerance) {
      return []
    }

    amountIn = BigNumber.from(amountIn)
    const bridge = await sdk.bridge(l1TokenSymbol)

    const { rate, priceImpact, amountOutMin, lpFeeAmount } = await bridge.getAmmData(
      sourceChain.slug,
      amountIn,
      isConvertingToHToken,
      slippageTolerance
    )

    rateDisplay = rate === 0 ? '-' : commafy(rate, 4)
    slippageToleranceDisplay = `${slippageTolerance}%`
    priceImpactDisplay = priceImpact < 0.01 ? '<0.01%' : `${commafy(priceImpact)}%`

    const sourceToken = isConvertingToHToken
      ? bridge.getCanonicalToken(destinationChain.slug)
      : bridge.getL2HopToken(destinationChain.slug)
    const destToken = isConvertingToHToken
      ? bridge.getL2HopToken(destinationChain.slug)
      : bridge.getCanonicalToken(destinationChain.slug)
    amountOutMinDisplay = toTokenDisplay(amountOutMin, destToken?.decimals, destToken?.symbol)
    feeDisplay = toTokenDisplay(lpFeeAmount, sourceToken?.decimals, sourceToken?.symbol)

    const estimatedReceivedDisplay = toTokenDisplay(
      amountOut,
      destToken?.decimals,
      destToken?.symbol
    )

    return (
      <>
        <DetailRow
          title="Estimated Received"
          tooltip={
            <AmmDetails
              rate={rate}
              slippageTolerance={slippageTolerance}
              priceImpact={priceImpact}
              amountOutMinDisplay={amountOutMinDisplay}
            />
          }
          value={estimatedReceivedDisplay}
          large
          bold
        />
      </>
    )
  }
}

export default AmmConvertOption

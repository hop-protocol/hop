import ConvertOption, { SendData } from './ConvertOption.js'
import Network from '#models/Network.js'
import React, { ReactNode } from 'react'
import { BigNumber, BigNumberish, Signer, utils } from 'ethers'
import { DetailRow } from '#components/InfoTooltip/DetailRow.js'
import { FeeDetails } from '#components/InfoTooltip/FeeDetails.js'
import { Hop, HopBridge, Token, TokenSymbol, ChainSlug } from '@hop-protocol/sdk'
import { RelayableChains } from '#utils/constants.js'
import { getBonderFeeWithId, toTokenDisplay } from '#utils/index.js'
import { getConvertedFees } from '#hooks/useFeeConversions.js'

type GetDetailsInput = {
  totalFee: BigNumber,
  adjustedDestinationTxFee: BigNumber,
  adjustedBonderFee: BigNumber,
  estimatedReceived: BigNumber,
  token?: Token
  relayFeeEth?: BigNumber
  destNetwork?: Network
}

class HopConvertOption extends ConvertOption {
  readonly name: string
  readonly slug: string
  readonly path: string

  constructor() {
    super()

    this.name = 'Hop Bridge'
    this.slug = 'hop-bridge'
    this.path = 'hop'
  }

  async convert(
    sdk: Hop,
    signer: Signer,
    sourceNetwork: Network,
    destNetwork: Network,
    isConvertingToHToken: boolean,
    l1TokenSymbol: TokenSymbol,
    amountIn: BigNumberish,
    amountOutMin: BigNumberish,
    deadline: number,
    bonderFee?: BigNumberish,
    customRecipient?: string
  ) {
    const bridge = sdk.bridge(l1TokenSymbol).connect(signer)
    if (bonderFee) {
      bonderFee = getBonderFeeWithId(BigNumber.from(bonderFee))
    }

    if (sourceNetwork.isLayer1 && !RelayableChains.includes(destNetwork.slug)) {
      bonderFee = BigNumber.from(0)
    }

    try {
      if (customRecipient) {
        utils.getAddress(customRecipient) // attempts to checksum
      }
    } catch (err) {
      throw new Error('Custom recipient address is invalid')
    }

    let recipient : string | undefined
    if (customRecipient) {
      recipient = customRecipient
    }

    // note: USDC.E out of L2 to ethereum (deprecated token route) will have to go through the 7 day exit time and be manually withdrawn.
    // note: MAGIC out of L2 to ethereum (deprecated token route) will have to go through the 7 day exit time and be manually withdrawn.
    const isDeprecatedRouteWithdrawal = ['USDC.e', 'MAGIC'].includes(l1TokenSymbol) && destNetwork?.slug === ChainSlug.Ethereum && !sourceNetwork?.isLayer1
    if (isDeprecatedRouteWithdrawal) {
      if (BigNumber.from(bonderFee ?? 0).eq(0)) {
        const isHTokenSend = true
        const relativeFee = await bridge.getBonderFeeRelative(amountIn, sourceNetwork?.slug, destNetwork?.slug, isHTokenSend)
        const absoluteFee = await bridge.getBonderFeeAbsolute(sourceNetwork?.slug, destNetwork?.slug)
        bonderFee = relativeFee.gt(absoluteFee) ? relativeFee : absoluteFee
      }
    }

    return bridge.sendHToken(amountIn, sourceNetwork.slug, destNetwork.slug, {
      bonderFee,
      recipient
    })
  }

  async getSendData(
    sdk: Hop,
    sourceNetwork: Network | undefined,
    destNetwork: Network | undefined,
    isConvertingToHToken: boolean,
    l1TokenSymbol: TokenSymbol | undefined,
    amountIn: BigNumberish | undefined
  ): Promise<SendData> {
    if (!l1TokenSymbol || !sourceNetwork || !destNetwork || !amountIn) {
      return {
        amountOut: undefined,
        details: [],
      }
    }

    amountIn = BigNumber.from(amountIn)
    const bridge = sdk.bridge(l1TokenSymbol)
    const token = sourceNetwork?.isLayer1
      ? bridge.getCanonicalToken(sourceNetwork?.slug)
      : bridge.getL2HopToken(sourceNetwork?.slug)

    const isHTokenSend = true
    let {
      totalFee,
      adjustedBonderFee,
      adjustedDestinationTxFee,
      relayFeeEth
    } = await bridge.getSendData(amountIn, sourceNetwork.slug, destNetwork.slug, isHTokenSend)
    const availableLiquidity = await bridge.getFrontendAvailableLiquidity(
      sourceNetwork.slug,
      destNetwork.slug,
      isHTokenSend
    )

    let estimatedReceived = amountIn
    let warning : any

    const isDeprecatedRouteWithdrawal = ['hUSDC.e', 'hMAGIC'].includes(token.symbol) && destNetwork?.slug === ChainSlug.Ethereum

    // note: bypass bonder fee since USDC.e out of L2 to ethereum (deprecated token route) will have to go through the 7 day exit time and be manually withdrawn.
    if (isDeprecatedRouteWithdrawal) {
      totalFee = BigNumber.from(0)
    }

    if (!sourceNetwork?.isLayer1 && amountIn.gt(availableLiquidity)) {
      const formattedAmount = toTokenDisplay(availableLiquidity, token.decimals)
      warning = `Insufficient liquidity. There is ${formattedAmount} ${l1TokenSymbol} available on ${destNetwork.name}.`

      // note: bypass liquidity check since USDC.e out of L2 to ethereum (deprecated token route) will have to go through the 7 day exit time.
      if (isDeprecatedRouteWithdrawal) {
        warning = ''
      }
    }

    if (estimatedReceived && totalFee?.gt(estimatedReceived)) {
      warning = 'Bonder fee greater than estimated received'
    }

    if (amountIn.gte(totalFee)) {
      estimatedReceived = amountIn.sub(totalFee)
    } else {
      warning = 'Amount must be greater than the fee'
    }

    if (bridge.signer) {
      const balance = await token.balanceOf()
      const enoughBalance = amountIn.lte(balance)
      if (!enoughBalance) {
        warning = 'Insufficient funds'
      }
    }

    const l1Token = bridge.getL1Token()
    const details = this.getDetails({
      totalFee,
      adjustedDestinationTxFee,
      adjustedBonderFee,
      estimatedReceived,
      token: l1Token,
      relayFeeEth,
      destNetwork
    })

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
    sourceNetwork?: Network,
    destNetwork?: Network,
  ): Promise<string> {
    if (!l1TokenSymbol) {
      throw new Error('Token symbol is required to get target address')
    }

    if (!sourceNetwork) {
      throw new Error('sourceNetwork is required to get target address')
    }

    const bridge = sdk.bridge(l1TokenSymbol)
    if (sourceNetwork.isLayer1) {
      const l1Bridge = await bridge.getL1Bridge()
      return l1Bridge.address
    } else {
      const l2Bridge = await bridge.getL2Bridge(sourceNetwork.slug)
      return l2Bridge.address
    }
  }

  async sourceToken(
    isConvertingToHToken: boolean,
    network?: Network,
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
    network?: Network,
    bridge?: HopBridge
  ): Promise<Token | undefined> {
    if (!bridge || !network) return

    if (isConvertingToHToken) {
      return bridge.getL2HopToken(network.slug)
    } else {
      return bridge.getL1Token()
    }
  }

  private getDetails(input: GetDetailsInput): ReactNode {
    const { totalFee, adjustedDestinationTxFee, adjustedBonderFee, estimatedReceived, token, relayFeeEth, destNetwork } = input
    if (!token) return <></>

    const {
      destinationTxFeeDisplay,
      destinationTxFeeUsdDisplay,
      bonderFeeDisplay,
      bonderFeeUsdDisplay,
      totalBonderFeeDisplay,
      estimatedReceivedDisplay,
      relayFeeEthDisplay
    } = getConvertedFees({ destinationTxFee: adjustedDestinationTxFee, bonderFee: adjustedBonderFee, estimatedReceived, destToken: token, relayFee: relayFeeEth })

    let estimatedReceivedDisplayString = estimatedReceivedDisplay
    if (destNetwork?.slug === ChainSlug.Polygon && token.symbol === TokenSymbol.MATIC) {
      estimatedReceivedDisplayString = estimatedReceivedDisplayString.replace('MATIC', 'POL')
    }

    return (
      <>
        {totalFee.gt(0) && (
          <DetailRow
            title={'Fees'}
            tooltip={
              <FeeDetails bonderFee={bonderFeeDisplay} bonderFeeUsd={bonderFeeUsdDisplay} destinationTxFee={destinationTxFeeDisplay} destinationTxFeeUsd={destinationTxFeeUsdDisplay} relayFee={relayFeeEthDisplay} />
            }
            value={totalBonderFeeDisplay}
            large
          />
        )}
        <DetailRow
          title="Estimated Received"
          tooltip="The estimated amount you will receive after fees"
          value={estimatedReceivedDisplayString}
          large
          bold
        />
      </>
    )
  }
}

export default HopConvertOption

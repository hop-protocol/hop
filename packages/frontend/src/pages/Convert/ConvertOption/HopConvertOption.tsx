import React, { ReactNode } from 'react'
import { Signer, BigNumber, BigNumberish } from 'ethers'
import { getAddress } from 'ethers/lib/utils'
import { Hop, HopBridge, Token, TokenSymbol } from '@hop-protocol/sdk'
import Network from 'src/models/Network'
import ConvertOption, { SendData } from './ConvertOption'
import { toTokenDisplay, getBonderFeeWithId } from 'src/utils'
import { RelayableChains } from 'src/utils/constants'
import DetailRow from 'src/components/InfoTooltip/DetailRow'
import FeeDetails from 'src/components/InfoTooltip/FeeDetails'
import { getConvertedFees } from 'src/hooks/useFeeConversions'

type GetDetailsInput = {
  totalFee: BigNumber,
  adjustedDestinationTxFee: BigNumber,
  adjustedBonderFee: BigNumber,
  estimatedReceived: BigNumber,
  token?: Token
  relayFeeEth?: BigNumber
}

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
    const bridge = sdk.bridge(l1TokenSymbol).connect(signer as Signer)
    if (bonderFee) {
      bonderFee = getBonderFeeWithId(BigNumber.from(bonderFee))
    }

    if (sourceNetwork.isLayer1 && !RelayableChains.includes(destNetwork.slug)) {
      bonderFee = BigNumber.from(0)
    }

    try {
      if (customRecipient) {
        getAddress(customRecipient) // attempts to checksum
      }
    } catch (err) {
      throw new Error('Custom recipient address is invalid')
    }

    let recipient : string | undefined
    if (customRecipient) {
      recipient = customRecipient
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

    const {
      totalFee,
      adjustedBonderFee,
      adjustedDestinationTxFee,
      relayFeeEth
    } = await bridge.getSendData(amountIn, sourceNetwork.slug, destNetwork.slug, true)
    const availableLiquidity = await bridge.getFrontendAvailableLiquidity(
      sourceNetwork.slug,
      destNetwork.slug
    )

    let estimatedReceived = amountIn
    let warning : any

    if (estimatedReceived && totalFee?.gt(estimatedReceived)) {
      warning = 'Bonder fee greater than estimated received'
    }

    if (!sourceNetwork?.isLayer1 && amountIn.gt(availableLiquidity)) {
      const formattedAmount = toTokenDisplay(availableLiquidity, token.decimals)
      warning = `Insufficient liquidity. There is ${formattedAmount} ${l1TokenSymbol} available on ${destNetwork.name}.`
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
      relayFeeEth
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
      const l1Bridge = await bridge.getL1BridgeWrapperOrL1Bridge(sourceNetwork.slug, destNetwork?.slug)
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
    const { totalFee, adjustedDestinationTxFee, adjustedBonderFee, estimatedReceived, token, relayFeeEth } = input
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
          value={estimatedReceivedDisplay}
          large
          bold
        />
      </>
    )
  }
}

export default HopConvertOption

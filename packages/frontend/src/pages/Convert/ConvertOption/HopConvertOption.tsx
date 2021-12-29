import React, { ReactNode } from 'react'
import { Signer, BigNumber, BigNumberish } from 'ethers'
import { Hop, HopBridge, Token } from '@hop-protocol/sdk'
import Network from 'src/models/Network'
import ConvertOption, { SendData } from './ConvertOption'
import { toTokenDisplay, getBonderFeeWithId } from 'src/utils'
import DetailRow from 'src/components/DetailRow'

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
    isForwardDirection: boolean,
    l1TokenSymbol: string,
    amountIn: BigNumberish,
    amountOutMin: BigNumberish,
    deadline: number,
    bonderFee?: BigNumberish
  ) {
    const bridge = sdk.bridge(l1TokenSymbol).connect(signer as Signer)
    if (bonderFee) {
      bonderFee = getBonderFeeWithId(BigNumber.from(bonderFee))
    }

    if (sourceNetwork.isLayer1) {
      bonderFee = BigNumber.from(0)
    }

    return bridge.sendHToken(amountIn, sourceNetwork.slug, destNetwork.slug, {
      bonderFee,
    })
  }

  async getSendData(
    sdk: Hop,
    sourceNetwork: Network | undefined,
    destNetwork: Network | undefined,
    isForwardDirection: boolean,
    l1TokenSymbol: string | undefined,
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

    const totalFees = await bridge.getTotalFee(amountIn, sourceNetwork.slug, destNetwork.slug)
    const availableLiquidity = await bridge.getFrontendAvailableLiquidity(
      sourceNetwork.slug,
      destNetwork.slug
    )

    let estimatedReceived = amountIn
    let warning

    if (estimatedReceived && totalFees?.gt(estimatedReceived)) {
      warning = 'Bonder fee greater than estimated received'
    }

    if (!sourceNetwork?.isLayer1 && amountIn.gt(availableLiquidity)) {
      const formattedAmount = toTokenDisplay(availableLiquidity, token.decimals)
      warning = `Insufficient liquidity. There is ${formattedAmount} ${l1TokenSymbol} available on ${destNetwork.name}.`
    }

    if (amountIn.gte(totalFees)) {
      estimatedReceived = amountIn.sub(totalFees)
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
    const details = this.getDetails(totalFees, estimatedReceived, l1Token)

    return {
      amountOut: amountIn,
      details,
      warning,
      bonderFee: totalFees,
    }
  }

  async getTargetAddress(
    sdk: Hop,
    l1TokenSymbol: string | undefined,
    sourceNetwork: Network | undefined,
    destNetwork: Network | undefined
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
    isForwardDirection: boolean,
    network?: Network,
    bridge?: HopBridge
  ): Promise<Token | undefined> {
    if (!bridge || !network) return

    if (isForwardDirection) {
      return bridge.getL1Token()
    } else {
      return bridge.getL2HopToken(network.slug)
    }
  }

  async destToken(
    isForwardDirection: boolean,
    network?: Network,
    bridge?: HopBridge
  ): Promise<Token | undefined> {
    if (!bridge || !network) return

    if (isForwardDirection) {
      return bridge.getL2HopToken(network.slug)
    } else {
      return bridge.getL1Token()
    }
  }

  private getDetails(
    totalFees: BigNumber,
    estimatedReceived: BigNumber,
    token: Token | undefined
  ): ReactNode {
    if (!token) return <></>

    const feeDisplay = toTokenDisplay(totalFees, token.decimals)
    const estimatedReceivedDisplay = toTokenDisplay(estimatedReceived, token.decimals)

    return (
      <>
        {totalFees.gt(0) && (
          <DetailRow
            title="L1 Transaction Fee"
            tooltip="This fee covers the L1 transaction fee paid by the Bonder when sending to L1."
            value={feeDisplay}
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

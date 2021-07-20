import React, { ReactNode } from 'react'
import { Signer, BigNumber, BigNumberish } from 'ethers'
import Network from 'src/models/Network'
import { Hop, HopBridge, Token } from '@hop-protocol/sdk'
import { DetailRowProps as DetailRow } from 'src/components/DetailRow'

export type SendData = {
  amountOut: BigNumber | undefined,
  details?: ReactNode,
  warning?: ReactNode,
  bonderFee?: BigNumber
}

abstract class ConvertOption {
  abstract readonly name: string
  abstract readonly slug: string
  abstract readonly path: string

  abstract getTargetAddress (
    sdk: Hop,
    l1TokenSymbol: string | undefined,
    sourceNetwork: Network | undefined,
    destNetwork: Network | undefined
  ): Promise<string>

  abstract getSendData (
    sdk: Hop,
    sourceNetwork: Network | undefined,
    destNetwork: Network | undefined,
    isForwardDirection: boolean,
    l1TokenSymbol: string | undefined,
    amountIn: BigNumberish | undefined
  ): Promise<SendData>

  abstract convert(
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
  ): Promise<any>

  abstract sourceToken (
    isForwardDirection: boolean,
    network: Network | undefined,
    bridge: HopBridge | undefined
  ): Promise<Token | undefined>

  abstract destToken (
    isForwardDirection: boolean,
    network: Network | undefined,
    bridge: HopBridge | undefined
  ): Promise<Token | undefined>
}

export default ConvertOption

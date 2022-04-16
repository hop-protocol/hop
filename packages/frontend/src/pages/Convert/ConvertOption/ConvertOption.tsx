import React, { ReactNode } from 'react'
import { Signer, BigNumber, BigNumberish } from 'ethers'
import Chain from 'src/models/Chain'
import { Hop, HopBridge, Token } from '@hop-protocol/sdk'

export type SendData = {
  amountOut: BigNumber | undefined
  details?: ReactNode
  warning?: ReactNode
  bonderFee?: BigNumber
}

abstract class ConvertOption {
  abstract readonly name: string
  abstract readonly slug: string
  abstract readonly path: string

  abstract getTargetAddress(
    sdk: Hop,
    l1TokenSymbol: string | undefined,
    sourceChain: Chain | undefined,
    destinationChain: Chain | undefined
  ): Promise<string>

  abstract getSendData(
    sdk: Hop,
    sourceChain: Chain | undefined,
    destinationChain: Chain | undefined,
    isConvertingToHToken: boolean,
    l1TokenSymbol: string | undefined,
    amountIn: BigNumberish | undefined
  ): Promise<SendData>

  abstract convert(
    sdk: Hop,
    signer: Signer,
    sourceChain: Chain,
    destinationChain: Chain,
    isConvertingToHToken: boolean,
    l1TokenSymbol: string,
    amountIn: BigNumberish,
    amountOutMin: BigNumberish,
    deadline: number,
    bonderFee?: BigNumberish
  ): Promise<any>

  abstract sourceToken(
    isConvertingToHToken: boolean,
    network: Chain | undefined,
    bridge: HopBridge | undefined
  ): Promise<Token | undefined>

  abstract destToken(
    isConvertingToHToken: boolean,
    network: Chain | undefined,
    bridge: HopBridge | undefined
  ): Promise<Token | undefined>
}

export default ConvertOption

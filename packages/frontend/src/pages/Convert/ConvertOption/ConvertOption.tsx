import { Signer, BigNumberish } from 'ethers'
import Network from 'src/models/Network'
import { Hop, HopBridge, Token } from '@hop-protocol/sdk'

export type DetailRow = {
  title: string,
  tooltip: string | undefined
  value: string | undefined
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

  abstract calcAmountOut (
    sdk: Hop,
    sourceNetwork: Network,
    destNetwork: Network,
    isForwardDirection: boolean,
    l1TokenSymbol: string,
    value: string
  ): Promise<any>

  abstract convert(
    sdk: Hop,
    signer: Signer,
    sourceNetwork: Network,
    destNetwork: Network,
    isForwardDirection: boolean,
    l1TokenSymbol: string,
    value: string
  ): Promise<any>

  abstract sourceToken (
    isForwardDirection: boolean,
    network?: Network,
    bridge?: HopBridge
  ): Promise<Token | undefined>

  abstract destToken (
    isForwardDirection: boolean,
    network?: Network,
    bridge?: HopBridge
  ): Promise<Token | undefined>

  abstract getDetails (
    sdk: Hop,
    amountIn: BigNumberish | undefined,
    sourceNetwork: Network | undefined,
    destNetwork: Network | undefined,
    isForwardDirection: boolean,
    l1TokenSymbol: string
  ): Promise<DetailRow[]>
}

export default ConvertOption

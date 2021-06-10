import Network from 'src/models/Network'
import { Hop, HopBridge, Token } from '@hop-protocol/sdk'
import { Signer } from 'ethers'

abstract class ConvertOption {
  abstract readonly name: string
  abstract readonly slug: string
  abstract readonly path: string

  abstract getTargetAddress (
    sdk: Hop,
    token: Token | undefined,
    sourceNetwork: Network | undefined,
    destNetwork: Network | undefined
  ): Promise<string>

  abstract calcAmountOut (
    sdk: Hop,
    sourceNetwork: Network,
    destNetwork: Network,
    isForwardDirection: boolean,
    token: Token,
    value: string
  ): Promise<any>

  abstract convert(
    sdk: Hop,
    signer: Signer,
    sourceNetwork: Network,
    destNetwork: Network,
    isForwardDirection: boolean,
    token: Token,
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
}

export default ConvertOption

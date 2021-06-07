import Network from 'src/models/Network'
import Token from 'src/models/Token'
import { Hop, HopBridge, Token as SDKToken } from '@hop-protocol/sdk'
import { Signer } from 'ethers'

abstract class ConvertOption {
  abstract readonly name: string
  abstract readonly slug: string
  abstract readonly path: string

  abstract getTargetAddress (
    sdk: Hop,
    token: SDKToken | undefined,
    sourceNetwork: Network | undefined
  ): Promise<string>

  abstract convert(
    sdk: Hop,
    signer: Signer,
    sourceNetwork: Network,
    destNetwork: Network,
    token: Token,
    value: string
  ): Promise<any>

  abstract sourceToken (
    isForwardDirection: boolean,
    network?: Network,
    bridge?: HopBridge
  ): Promise<SDKToken | undefined>

  abstract destToken (
    isForwardDirection: boolean,
    network?: Network,
    bridge?: HopBridge
  ): Promise<SDKToken | undefined>
}

export default ConvertOption

import ConvertOption from './ConvertOption'
import Network from 'src/models/Network'
import Token from 'src/models/Token'
import { Hop, HopBridge, Token as SDKToken } from '@hop-protocol/sdk'
import { Signer } from 'ethers'
import { ZERO_ADDRESS } from 'src/constants'

class HopConvertOption extends ConvertOption {
  readonly name: string
  readonly slug: string
  readonly path: string

  constructor () {
    super()

    this.name = 'Hop Bridge'
    this.slug = 'hop-bridge'
    this.path = '/hop'
  }

  async convert (
    sdk: Hop,
    signer: Signer,
    sourceNetwork: Network,
    destNetwork: Network,
    token: Token,
    value: string
  ) {
    const bridge = sdk
      .bridge(token.symbol)
      .connect(signer as Signer)

    const amountOutMin = 0
    const deadline = 0
    const relayer = ZERO_ADDRESS
    const relayerFee = 0
    const recipient = await signer?.getAddress()

    return bridge.send(
      value,
      sourceNetwork.slug,
      destNetwork.slug,
      {
        recipient,
        amountOutMin,
        deadline,
        relayer,
        relayerFee
      }
    )
  }

  async approve (
    sdk: Hop,
    signer: Signer,
    sourceNetwork: Network,
    destNetwork: Network,
    token: Token,
    value: string
  ) {
    
  }

  async sourceToken (isForwardDirection: boolean, network?: Network, bridge?: HopBridge): Promise<SDKToken | undefined> {
    if (!bridge || !network) return

    if (isForwardDirection) {
      return bridge.getL1Token()
    } else {
      return bridge.getL2HopToken(network.slug)
    }
  }

  async destToken (isForwardDirection: boolean, network?: Network, bridge?: HopBridge): Promise<SDKToken | undefined> {
    if (!bridge || !network) return

    if (isForwardDirection) {
      return bridge.getL2HopToken(network.slug)
    } else {
      return bridge.getL1Token()
    }
  }
}

export default HopConvertOption

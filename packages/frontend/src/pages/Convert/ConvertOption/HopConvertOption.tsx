import { Signer, BigNumber, BigNumberish } from 'ethers'
import { Hop, HopBridge, Token } from '@hop-protocol/sdk'
import Network from 'src/models/Network'
import ConvertOption, { DetailRow } from './ConvertOption'

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
    isForwardDirection: boolean,
    l1TokenSymbol: string,
    value: string
  ) {
    const bridge = sdk
      .bridge(l1TokenSymbol)
      .connect(signer as Signer)

    return bridge.sendHToken(
      value,
      sourceNetwork.slug,
      destNetwork.slug
    )
  }

  async calcAmountOut (
    sdk: Hop,
    sourceNetwork: Network,
    destNetwork: Network,
    isForwardDirection: boolean,
    l1TokenSymbol: string,
    value: string
  ) {
    return BigNumber.from(value)
  }

  async getTargetAddress (
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

  async sourceToken (isForwardDirection: boolean, network?: Network, bridge?: HopBridge): Promise<Token | undefined> {
    if (!bridge || !network) return

    if (isForwardDirection) {
      return bridge.getL1Token()
    } else {
      return bridge.getL2HopToken(network.slug)
    }
  }

  async destToken (isForwardDirection: boolean, network?: Network, bridge?: HopBridge): Promise<Token | undefined> {
    if (!bridge || !network) return

    if (isForwardDirection) {
      return bridge.getL2HopToken(network.slug)
    } else {
      return bridge.getL1Token()
    }
  }

  async getDetails (
    sdk: Hop,
    amountIn: BigNumberish | undefined,
    sourceNetwork: Network | undefined,
    destNetwork: Network | undefined,
    isForwardDirection: boolean,
    l1TokenSymbol: string
  ): Promise<DetailRow[]> {
    return []
  }
}

export default HopConvertOption

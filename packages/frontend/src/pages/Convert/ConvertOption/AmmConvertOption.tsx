import ConvertOption from './ConvertOption'
import Network from 'src/models/Network'
import { Hop, HopBridge, Token } from '@hop-protocol/sdk'
import { Signer, BigNumber } from 'ethers'

class AmmConvertOption extends ConvertOption {
  readonly name: string
  readonly slug: string
  readonly path: string

  constructor () {
    super()

    this.name = 'AMM'
    this.slug = 'amm'
    this.path = '/amm'
  }

  async getTargetAddress (
    sdk: Hop,
    token: Token | undefined,
    sourceNetwork: Network | undefined,
    destNetwork: Network | undefined
  ): Promise<string> {
    if (!token) {
      throw new Error('Token is required to get target address')
    }

    if (!sourceNetwork) {
      throw new Error('sourceNetwork is required to get target address')
    }

    const bridge = sdk.bridge(token.symbol)
    const amm = await bridge.getSaddleSwap(sourceNetwork.slug)
    return amm.address
  }

  async calcAmountOut (
    sdk: Hop,
    sourceNetwork: Network,
    destNetwork: Network,
    isForwardDirection: boolean,
    token: Token,
    value: string
  ) {
    return BigNumber.from(value)
  }

  async convert (
    sdk: Hop,
    signer: Signer,
    sourceNetwork: Network,
    destNetwork: Network,
    isForwardDirection: boolean,
    token: Token,
    value: string
  ) {
    const bridge = await sdk
      .bridge(token.symbol)
      .connect(signer as Signer)

    const amountOutMin = 0
    const deadline = (Date.now() / 1000 + 300) | 0

    return bridge.execSaddleSwap(
      sourceNetwork.slug,
      isForwardDirection,
      value,
      amountOutMin,
      deadline
    )
  }

  async sourceToken (isForwardDirection: boolean, network?: Network, bridge?: HopBridge): Promise<Token | undefined> {
    if (!bridge || !network) return

    if (isForwardDirection) {
      return bridge.getCanonicalToken(network.slug)
    } else {
      return bridge.getL2HopToken(network.slug)
    }
  }

  async destToken (isForwardDirection: boolean, network?: Network, bridge?: HopBridge): Promise<Token | undefined> {
    if (!bridge || !network) return

    if (isForwardDirection) {
      return bridge.getL2HopToken(network.slug)
    } else {
      return bridge.getCanonicalToken(network.slug)
    }
  }
}

export default AmmConvertOption

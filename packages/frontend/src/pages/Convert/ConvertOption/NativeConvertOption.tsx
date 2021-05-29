import ConvertOption from './ConvertOption'
import Network from 'src/models/Network'
import Token from 'src/models/Token'
import { Hop } from '@hop-protocol/sdk'
import { Signer } from 'ethers'

class NativeConvertOption extends ConvertOption {
  readonly name: string
  readonly slug: string
  readonly path: string

  constructor () {
    super()

    this.name = 'Native Bridge'
    this.slug = 'native-bridge'
    this.path = '/bridge'
  }

  async convert (
    sdk: Hop,
    signer: Signer,
    sourceNetwork: Network,
    destNetwork: Network,
    token: Token,
    value: string
  ) {
    const destSlug = destNetwork?.slug
    const bridge = sdk
      .canonicalBridge(token.symbol, destSlug)
      .connect(signer as Signer)

    return bridge.connect(signer as Signer).deposit(value)
  }
}

export default NativeConvertOption

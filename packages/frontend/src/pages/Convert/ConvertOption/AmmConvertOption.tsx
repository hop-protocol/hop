import ConvertOption from './ConvertOption'
import Network from 'src/models/Network'
import Token from 'src/models/Token'
import { Hop } from '@hop-protocol/sdk'
import { Signer } from 'ethers'

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

  async convert (
    sdk: Hop,
    signer: Signer,
    sourceNetwork: Network,
    destNetwork: Network,
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
      false,
      value,
      amountOutMin,
      deadline
    )
  }
}

export default AmmConvertOption

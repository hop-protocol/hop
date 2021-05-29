import ConvertOption from './ConvertOption'
import Network from 'src/models/Network'
import Token from 'src/models/Token'
import { Hop } from '@hop-protocol/sdk'
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
}

export default HopConvertOption

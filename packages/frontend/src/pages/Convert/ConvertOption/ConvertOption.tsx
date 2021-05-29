import Network from 'src/models/Network'
import Token from 'src/models/Token'
import { Hop } from '@hop-protocol/sdk'
import { Signer } from 'ethers'

abstract class ConvertOption {
  abstract readonly name: string
  abstract readonly slug: string
  abstract readonly path: string

  abstract convert(
    sdk: Hop,
    signer: Signer,
    sourceNetwork: Network,
    destNetwork: Network,
    token: Token,
    value: string
  ): Promise<any>
}

export default ConvertOption

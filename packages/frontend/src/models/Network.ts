import * as ethers from 'ethers'

export type Networkish = Network | string | undefined

export type NetworkProps = {
  name: string
  slug: string
  imageUrl: string
  rpcUrl: string
  networkId: string
  isLayer1?: boolean
}

class Network {
  readonly name: string
  readonly slug: string
  readonly imageUrl: string
  readonly provider: ethers.providers.Provider
  readonly rpcUrl: string
  readonly isLayer1: boolean
  readonly networkId: string

  constructor (props: NetworkProps) {
    this.name = props.name
    this.slug = props.slug
    this.imageUrl = props.imageUrl
    this.rpcUrl = props.rpcUrl
    this.provider = new ethers.providers.StaticJsonRpcProvider(props.rpcUrl)
    this.isLayer1 = props.isLayer1 ? props.isLayer1 : false
    this.networkId = props.networkId
  }

  toString () {
    return this.name
  }

  eq (otherNetwork: Network) {
    return otherNetwork.networkId === this.networkId
  }
}

export default Network

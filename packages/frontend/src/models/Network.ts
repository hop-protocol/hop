import * as ethers from 'ethers'

export type Networkish = Network | string | undefined

export type NetworkProps = {
  name: string
  slug: string
  imageUrl: string
  rpcUrl: string
  isLayer1?: boolean
}

class Network {
  name: string
  slug: string
  imageUrl: string
  provider: ethers.providers.Provider
  rpcUrl: string
  isLayer1: boolean

  constructor (props: NetworkProps) {
    this.name = props.name
    this.slug = props.slug
    this.imageUrl = props.imageUrl
    this.rpcUrl = props.rpcUrl
    this.provider = new ethers.providers.JsonRpcProvider(props.rpcUrl)
    this.isLayer1 = props.isLayer1 ? props.isLayer1 : false
  }

  toString () {
    return this.name
  }

  key () {
    return ethers.utils.solidityKeccak256(['string'], [this.slug])
  }
}

export default Network

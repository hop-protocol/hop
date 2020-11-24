import * as ethers from 'ethers'

export type Networkish = Network | string | undefined

export type NetworkProps = {
  name: string
  imageUrl: string
  rpcUrl: string
}

class Network {
  name: string
  imageUrl: string
  provider: ethers.providers.Provider

  constructor (props: NetworkProps) {
    this.name = props.name
    this.imageUrl = props.imageUrl
    this.provider = new ethers.providers.JsonRpcProvider(props.rpcUrl)
  }

  toString () {
    return this.name
  }

  key () {
    return ethers.utils.solidityKeccak256(['string'], [this.name])
  }
}

export default Network

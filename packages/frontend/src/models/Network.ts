import * as ethers from 'ethers'

export type Networkish = Network | string | undefined

class Network {
  name: string

  constructor(network: Networkish) {
    if (!network) {
      throw new Error(`Invalid network '${network?.toString()}'`)
    }

    this.name = network.toString()
  }

  static from (network: Networkish): Network {
    return new Network(network)
  }

  toString () {
    return this.name
  }

  key () {
    return ethers.utils.solidityKeccak256(['string'], [this.name])
  }
}

export default Network

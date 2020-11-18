import Network, { Networkish } from './Network'
import Address, { Addressish } from './Address'
import { BigNumber, BigNumberish } from 'ethers'

type TokenProps = {
  symbol: string
  tokenName: string
  decimals?: number
  addresses: {[key: string]: Addressish}
  rates: {[key: string]: BigNumberish}
}

class Token {
  symbol: string
  tokenName: string
  decimals: number
  addresses: {[key: string]: Address}
  rates: {[key: string]: BigNumber}

  constructor(props: TokenProps) {
    this.symbol = props.symbol
    this.tokenName = props.tokenName
    this.decimals = props.decimals || 18
    this.addresses = {}
    Object.keys(props.addresses).forEach( key => 
      this.addresses[key] = Address.from(props.addresses[key])
    )
    this.rates = {}
    Object.keys(props.rates).forEach( key => 
      this.rates[key] = BigNumber.from(props.rates[key])
    )
  }

  addressForNetwork(network: Networkish): Address {
    const _network = Network.from(network)
    return this.addresses[_network.name]
  }

  rateForNetwork(network: Networkish): BigNumber {
    const _network = Network.from(network)
    return this.rates[_network.name]
  }
}

export default Token
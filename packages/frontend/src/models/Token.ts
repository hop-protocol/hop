import Network from './Network'
import Address from './Address'
import { BigNumber, BigNumberish, Contract } from 'ethers'

type TokenProps = {
  symbol: string
  tokenName: string
  decimals?: number
  contracts: { [key: string]: Contract | undefined }
  rates: { [key: string]: BigNumberish }
}

class Token {
  symbol: string
  tokenName: string
  decimals: number
  contracts: { [key: string]: Contract | undefined }
  addresses: { [key: string]: Address }
  rates: { [key: string]: BigNumber }

  constructor (props: TokenProps) {
    this.symbol = props.symbol
    this.tokenName = props.tokenName
    this.decimals = props.decimals || 18
    this.contracts = props.contracts
    this.addresses = {}
    Object.keys(props.contracts).forEach(key => {
      const contract = props.contracts[key]
      if (contract) {
        this.addresses[key] = new Address(contract.address)
      }
    })
    this.rates = {}
    Object.keys(props.rates).forEach(
      key => (this.rates[key] = BigNumber.from(props.rates[key]))
    )
  }

  contractForNetwork (network: Network): Contract {
    const contract = this.contracts[network.slug]
    if (!contract)
      throw new Error(`No token contract for Network '${network.name}'`)
    return contract
  }

  addressForNetwork (network: Network): Address {
    return new Address(this.contractForNetwork(network).address)
  }

  rateForNetwork (network: Network | undefined): BigNumber {
    if (!network) {
      return BigNumber.from('0')
    }
    return this.rates[network.slug]
  }
}

export default Token

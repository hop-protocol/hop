import { ethers } from 'ethers'

class Token {
  readonly chainId: number
  readonly address: string
  readonly decimals: number
  readonly symbol: string
  readonly name: string

  constructor (
    chainId: number | string,
    address: string,
    decimals: number,
    symbol: string,
    name: string
  ) {
    this.chainId = Number(chainId)
    this.address = ethers.utils.getAddress(address)
    this.decimals = decimals
    this.symbol = symbol
    this.name = name
  }
}

export default Token

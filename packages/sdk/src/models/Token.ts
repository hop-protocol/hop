import { ethers } from 'ethers'
import { metadata } from '../config'

class Token {
  public readonly chainId: number
  public readonly address: string
  public readonly decimals: number
  public readonly symbol: string
  public readonly name: string

  static USDC = 'USDC'
  static DAI = 'DAI'
  static WBTC = 'WBTC'
  static sBTC = 'sBTC'
  static sETH = 'sETH'

  constructor (
    chainId: number | string,
    address: string,
    decimals: number,
    symbol: string = '',
    name: string = ''
  ) {
    if (chainId) {
      this.chainId = Number(chainId)
    }
    if (address) {
      this.address = ethers.utils.getAddress(address)
    }
    if (symbol) {
      this.symbol = symbol
    }
    if (name) {
      this.name = name
    }
    if (!decimals && symbol) {
      this.decimals = metadata.tokens[symbol].decimals
    }
  }
}

export default Token

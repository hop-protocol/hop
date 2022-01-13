import { AllTokens, Networks, Tokens } from '../constants'
import { ethers } from 'ethers'
import { metadata } from '../config'

class Token {
  public readonly chainId: number
  public readonly address: string
  public readonly decimals: number
  public readonly symbol: AllTokens
  public readonly name: AllTokens

  static ETH = 'ETH'
  static WETH = 'WETH'
  static MATIC = 'MATIC'
  static WMATIC = 'WMATIC'
  static XDAI = 'XDAI'
  static WXDAI = 'WXDAI'
  static USDC = 'USDC'
  static USDT = 'USDT'
  static DAI = 'DAI'
  static WBTC = 'WBTC'
  static sBTC = 'sBTC'
  static sETH = 'sETH'

  constructor (
    chainId: number | string,
    address: string,
    decimals: number,
    symbol: AllTokens,
    name: AllTokens
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
    } else if (symbol) {
      this.name = symbol
    }
    if (decimals) {
      this.decimals = decimals
    }
    if (!decimals && symbol) {
      this.decimals = metadata.tokens?.[Networks.Mainnet]?.[symbol]?.decimals
    }
  }

  get canonicalSymbol () {
    return Token.getCanonicalSymbol(this.symbol)
  }

  static getCanonicalSymbol (tokenSymbol: AllTokens) {
    const isWrappedToken = [Token.WETH, Token.WMATIC, Token.WXDAI].includes(tokenSymbol)
    if (isWrappedToken) {
      tokenSymbol = tokenSymbol.replace(/^W/, '') as Tokens
    }
    if (tokenSymbol === Tokens.XDAI) {
      tokenSymbol = Tokens.DAI
    }
    return tokenSymbol
  }
}

export default Token

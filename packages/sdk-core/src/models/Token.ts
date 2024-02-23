import { CanonicalToken, TokenSymbol } from '../constants'
import { getAddress } from 'ethers/lib/utils'
import { metadata } from '#config/index.js'

export class TokenModel {
  public readonly chainId: number
  public readonly address: string
  public readonly decimals: number
  public readonly symbol: TokenSymbol
  public readonly name: TokenSymbol

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
  static HOP = 'HOP'
  static OP = 'OP'
  static SNX = 'SNX'
  static sUSD = 'sUSD'
  static rETH = 'rETH'
  static UNI = 'UNI'
  static MAGIC = 'MAGIC'

  constructor (
    chainId: number | string,
    address: string,
    decimals: number,
    symbol: TokenSymbol,
    name: TokenSymbol
  ) {
    if (chainId) {
      this.chainId = Number(chainId)
    }
    if (address) {
      this.address = getAddress(address)
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
      this.decimals = metadata.tokens[symbol]?.decimals
    }
  }

  get canonicalSymbol () {
    return TokenModel.getCanonicalSymbol(this.symbol)
  }

  static getCanonicalSymbol (tokenSymbol: TokenSymbol) {
    const isWrappedToken = [TokenModel.WETH, TokenModel.WMATIC, TokenModel.WXDAI].includes(tokenSymbol)
    if (isWrappedToken) {
      tokenSymbol = tokenSymbol.replace(/^W/, '') as CanonicalToken
    }
    if (tokenSymbol === CanonicalToken.XDAI) {
      tokenSymbol = CanonicalToken.DAI
    }
    return tokenSymbol
  }
}

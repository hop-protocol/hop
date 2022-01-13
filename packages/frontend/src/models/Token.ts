import Network from './Network'
import Address from './Address'
import { TokenSymbol } from '@hop-protocol/sdk'

type TokenProps = {
  symbol: TokenSymbol
  tokenName: string
  imageUrl: string
  decimals?: number
  supportedNetworks?: string[]
}

class Token {
  readonly symbol: TokenSymbol
  readonly tokenName: string
  readonly decimals: number
  readonly imageUrl: string
  readonly addresses: { [key: string]: Address } = {}
  readonly supportedNetworks: string[] = []

  constructor(props: TokenProps) {
    this.symbol = props.symbol
    this.tokenName = props.tokenName
    this.imageUrl = props.imageUrl
    this.decimals = props.decimals || 18
    this.supportedNetworks = props.supportedNetworks || []
  }

  networkSymbol(network: Network | undefined) {
    const prefix = network?.slug || ''
    return prefix + '.' + this.symbol
  }

  eq(otherToken: Token) {
    return otherToken.symbol === this.symbol
  }
}

export default Token

declare class Token {
  readonly chainId: number
  readonly address: string
  readonly decimals: number
  readonly symbol: string
  readonly name: string
  static USDC: string
  static DAI: string
  constructor (
    chainId: number | string,
    address: string,
    decimals: number,
    symbol: string,
    name: string
  )
}
export default Token
//# sourceMappingURL=Token.d.ts.map

export type TokenConfig = {
  readonly symbol: string
  readonly name: string
  readonly decimals: number
  readonly image: string
  readonly coingeckoId: string
  readonly isStableCoin: boolean
  readonly addresses: { [chainId: string]: string }
}

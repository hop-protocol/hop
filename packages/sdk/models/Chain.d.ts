import { providers } from 'ethers'
declare type Provider = providers.Provider
declare class Chain {
  readonly chainId: number
  readonly name: string
  readonly slug: string
  readonly provider: Provider | null
  readonly isL1: boolean
  static Kovan: Chain
  static Optimism: Chain
  static Arbitrum: Chain
  static xDai: Chain
  constructor (chainId: number | string, name: string, provider: Provider)
  equals (otherChain: Chain): boolean
}
export default Chain
//# sourceMappingURL=Chain.d.ts.map

import { type BigNumberish } from 'ethers'

export type { ClaimStruct, HopStruct } from './contracts/types/index.js'

export type RailsPath = {
  chainId: string
  token: string
  counterpartChainId: string
  counterpartToken: string
  initialReserve: BigNumberish
}

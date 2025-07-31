import { BigNumber } from 'ethers'

export type PathConfig = {
  pathId: string
  chainId0: string
  tokenAddress0: string
  chainId1: string
  tokenAddress1: string
  initialReserve: BigNumber
}

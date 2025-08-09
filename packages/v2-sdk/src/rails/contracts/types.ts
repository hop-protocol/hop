import type { BigNumber } from 'ethers'

export type Claim = {
  createdAt: BigNumber
  index: BigNumber
  to: string
  amountOut: BigNumber
  maxBonderFee: BigNumber
  totalClaims: BigNumber
  nextHopsHash: string
  totalAttested: BigNumber
  totalAddedToBucketMaxConfirmed: BigNumber
  bondedBy: string
  withdrawnBy: string
}

export type HopStruct = {
  pathId: string
  maxBonderFee: BigNumber
  maxTotalSent: BigNumber
  attestedClaimId: string
  updater: string
}

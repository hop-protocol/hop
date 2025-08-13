import type { BigNumber } from 'ethers'
import { type RailsPath as RailsPathType, railsPathABI } from './static/index.js'
import type { Claim } from './types.js'
import type { RPC } from '../types.js'
import { BaseRailsContract } from './BaseRailsContract.js'

export type RailsPathContractEvent = RailsPathType['interface']['events']
export type RailsPathContractFilter = RailsPathType['filters']

export class RailsPathContract extends BaseRailsContract<RailsPathType> {

  constructor(address: string, rpc?: RPC) {
    super(address, railsPathABI, rpc)
  }

  async getClaim(claimId: string): Promise<Claim> {
    // TODO: Validation & logging
    const claim = await this.contract.getClaim(claimId)
    return this.#normalizeClaim(claim)
  }

  async getHeadClaimId(): Promise<string> {
    // TODO: Validation & logging
    return this.contract.getHeadClaimId()
  }

  async isValidClaim(claimId: string): Promise<boolean> {
    // TODO: Validation & logging
    return this.contract.isValidClaim(claimId)
  }

  async isValidTransfer(claimId: string): Promise<boolean> {
    // TODO: Validation & logging
    return this.contract.isValidTransfer(claimId)
  }

  async getSourcePool(attestedClaimId: string): Promise<BigNumber> {
    // TODO: Validation & logging
    return this.contract.getSourcePool(attestedClaimId)
  }

  async totalFraudulent(): Promise<BigNumber> {
    // TODO: Validation & logging
    return this.contract.totalFraudulent()
  }

  #normalizeClaim(claim: Claim): Claim {
    // Normalize Typechain struct from tuple+object to object
    return {
      createdAt: claim.createdAt,
      index: claim.index,
      to: claim.to,
      amountOut: claim.amountOut,
      maxBonderFee: claim.maxBonderFee,
      totalClaims: claim.totalClaims,
      nextHopsHash: claim.nextHopsHash,
      totalAttested: claim.totalAttested,
      totalAddedToBucketMaxConfirmed: claim.totalAddedToBucketMaxConfirmed,
      bondedBy: claim.bondedBy,
      withdrawnBy: claim.withdrawnBy
    }
  }
}
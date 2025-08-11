import { type BigNumber, Contract } from 'ethers'
import type { RailsPath as RailsPathContract } from './types/index.js'
import type { Claim } from './types.js'
import type { RPC } from '../types.js'

import { railsPathABI } from './abis/index.js'

export class RailsPath {
  readonly #contract: RailsPathContract

  constructor(address: string, rpc: RPC) {
    this.#contract = new Contract(address, railsPathABI, rpc) as RailsPathContract
  }

  async getClaim(claimId: string): Promise<Claim> {
    // TODO: Validation & logging
    const claim = await this.#contract.getClaim(claimId)
    return this.#normalizeClaim(claim)
  }

  async getHeadClaimId(): Promise<string> {
    // TODO: Validation & logging
    return this.#contract.getHeadClaimId()
  }

  async isValidClaim(claimId: string): Promise<boolean> {
    // TODO: Validation & logging
    return this.#contract.isValidClaim(claimId)
  }

  async isValidTransfer(claimId: string): Promise<boolean> {
    // TODO: Validation & logging
    return this.#contract.isValidTransfer(claimId)
  }

  async getSourcePool(attestedClaimId: string): Promise<BigNumber> {
    // TODO: Validation & logging
    return this.#contract.getSourcePool(attestedClaimId)
  }

  async totalFraudulent(): Promise<BigNumber> {
    // TODO: Validation & logging
    return this.#contract.totalFraudulent()
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
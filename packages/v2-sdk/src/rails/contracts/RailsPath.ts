import {
  type BigNumber,
  type CallOverrides,
  type Signer,
  Contract,
  providers
} from 'ethers'
import type { RailsPath as RailsPathContract } from './types/index.js'
import type { Claim } from './types.js'
import { type Addressish, getAddress } from '#models/index.js'

import { railsPathABI } from './abis/index.js'

export class RailsPath {
  readonly #contract: RailsPathContract

  constructor(address: Addressish, provider: Signer | providers.Provider) {
    address = getAddress(address).toString()
    this.#contract = new Contract(address, railsPathABI, provider) as RailsPathContract
  }
  async getClaim(claimId: string, overrides?: CallOverrides): Promise<Claim> {
    // TODO: Validation & logging
    const claim = await this.#contract.getClaim(claimId, overrides)
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

  async getHeadClaimId(overrides?: CallOverrides): Promise<string> {
    // TODO: Validation & logging
    return this.#contract.getHeadClaimId(overrides)
  }

  async isValidClaim(claimId: string, overrides?: CallOverrides): Promise<boolean> {
    // TODO: Validation & logging
    return this.#contract.isValidClaim(claimId, overrides)
  }

  async isValidTransfer(claimId: string, overrides?: CallOverrides): Promise<boolean> {
    // TODO: Validation & logging
    return this.#contract.isValidTransfer(claimId, overrides)
  }

  async getSourcePool(attestedClaimId: string, overrides?: CallOverrides): Promise<BigNumber> {
    // TODO: Validation & logging
    return this.#contract.getSourcePool(attestedClaimId, overrides)
  }

  async totalFraudulent(overrides?: CallOverrides): Promise<BigNumber> {
    // TODO: Validation & logging
    return this.#contract.totalFraudulent(overrides)
  }
}
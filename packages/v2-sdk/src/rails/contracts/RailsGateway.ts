import {
  type BigNumber,
  type BigNumberish,
  type CallOverrides,
  type Signer,
  Contract,
  providers
} from 'ethers'
import type { HopStruct, RailsGateway as RailsGatewayContract } from './types/index.js'
import { railsGatewayABI } from './abis/index.js'

export type IRailsGateway = InstanceType<typeof RailsGateway>

export class RailsGateway extends Contract {
  static connect(address: string, signerOrProvider: Signer | providers.Provider): RailsGateway {
    return new Contract(address, railsGatewayABI, signerOrProvider) as RailsGatewayContract
  }

  async send(
    to: string,
    amount: BigNumberish,
    hops: HopStruct[] = [],
    overrides?: CallOverrides
  ): Promise<providers.TransactionResponse> {

    // TODO: Validation

    return super.send(to, amount, hops, overrides)
  }

  async postClaim(
    pathId: string,
    claimId: string,
    to: string,
    amount: BigNumberish,
    maxBonderFee: BigNumberish,
    attestedClaimId: string,
    sourcePool: BigNumberish,
    sourceTotalFraudulent: BigNumberish,
    nextHopsHash: string,
    overrides?: CallOverrides
  ): Promise<providers.TransactionResponse> {

    // TODO: Validation

    return super.postClaim(
      pathId,
      claimId,
      to,
      amount,
      maxBonderFee,
      attestedClaimId,
      sourcePool,
      sourceTotalFraudulent,
      nextHopsHash,
      overrides
    )
  }

  async bond(
    pathId: string,
    claimId: string,
    bonderFee: BigNumberish,
    nextHops: HopStruct[],
    overrides?: CallOverrides
  ): Promise<providers.TransactionResponse> {

    // TODO: Validation

    return super.bond(pathId, claimId, bonderFee, nextHops, overrides)
  }

  async getAmountOut(
    pathId: string,
    amount: BigNumberish,
    attestedClaimId: string,
    sourcePool: BigNumberish,
    sourceTotalFraudulent: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber> {

    // TODO: Validation

    return super.getAmountOut(pathId, amount, attestedClaimId, sourcePool, sourceTotalFraudulent, overrides)
  }
}

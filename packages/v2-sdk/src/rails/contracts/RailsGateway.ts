import {
  type Signer,
  type BigNumberish,
  type CallOverrides,
  BigNumber,
  Contract,
  providers
} from 'ethers'
import {
  type Addressish,
  type Pathish,
  Address,
  Path
} from '#models/index.js'
import type { RailsGateway as RailsGatewayContract, HopStruct } from './types/index.js'
import { railsGatewayABI } from './abis/index.js'

export class RailsGateway {
  readonly #contract: RailsGatewayContract

  constructor(address: Addressish, provider: Signer | providers.Provider) {
    address = Address.getAddress(address).toString()
    this.#contract = new Contract(address, railsGatewayABI, provider) as RailsGatewayContract
  }

  async send(
    to: Addressish,
    amount: BigNumberish,
    hops: HopStruct[],
    overrides?: CallOverrides
  ): Promise<providers.TransactionResponse> {
    // TODO: Validation and logging
    return this.#contract.send(
      Address.getAddress(to).toString(),
      amount,
      hops,
      overrides
    )
  }

  async postClaim(
    pathId: Pathish,
    claimId: string,
    to: Addressish,
    amount: BigNumberish,
    maxBonderFee: BigNumberish,
    attestedClaimId: string,
    sourcePool: BigNumberish,
    sourceTotalFraudulent: BigNumberish,
    nextHopsHash: string,
    overrides?: CallOverrides
  ): Promise<providers.TransactionResponse> {
    // TODO: Validation and logging
    return this.#contract.postClaim(
      Path.getPath(pathId).pathId,
      claimId,
      Address.getAddress(to).toString(),
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
    pathId: Pathish,
    claimId: string,
    bonderFee: BigNumberish,
    nextHops: HopStruct[],
    overrides?: CallOverrides
  ): Promise<providers.TransactionResponse> {
    // TODO: Validation and logging
    return this.#contract.bond(
      Path.getPath(pathId).pathId,
      claimId,
      bonderFee,
      nextHops,
      overrides
    )
  }

  async getAmountOut(
    pathId: Pathish,
    amount: BigNumberish,
    attestedClaimId: string,
    sourcePool: BigNumberish,
    sourceTotalFraudulent: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber> {
    // TODO: Validation and logging
    return this.#contract.getAmountOut(
      Path.getPath(pathId).pathId,
      amount,
      attestedClaimId,
      sourcePool,
      sourceTotalFraudulent,
      overrides
    )
  }

  async getPath(pathId: Pathish, overrides?: CallOverrides): Promise<string> {
    // TODO: Validation and logging
    return this.#contract.getPath(Path.getPath(pathId).pathId, overrides)
  }
}

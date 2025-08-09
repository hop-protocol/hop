import {
  type BigNumber,
  type providers,
  type CallOverrides,
  Contract
} from 'ethers'
import type { RailsGateway as RailsGatewayContract } from './types/index.js'
import type { RailsPath } from './RailsPath.js'
import { railsGatewayABI } from './abis/index.js'
import type { RPC } from '../types.js'
import { getRailsPath } from './RailsFactory.js'
import type { HopStruct } from './types.js'

export class RailsGateway {
  readonly #contract: RailsGatewayContract

  constructor(address: string, rpc: RPC) {
    this.#contract = new Contract(address, railsGatewayABI, rpc) as RailsGatewayContract
  }

  async send(
    to: string,
    amount: BigNumber,
    hops: HopStruct[],
    overrides?: CallOverrides
  ): Promise<providers.TransactionResponse> {
    // TODO: Validation and logging
    return this.#contract.send(
      to,
      amount,
      hops,
      overrides
    )
  }

  async postClaim(
    pathId: string,
    claimId: string,
    to: string,
    amount: BigNumber,
    maxBonderFee: BigNumber,
    attestedClaimId: string,
    sourcePool: BigNumber,
    sourceTotalFraudulent: BigNumber,
    nextHopsHash: string,
    overrides?: CallOverrides
  ): Promise<providers.TransactionResponse> {
    // TODO: Validation and logging
    return this.#contract.postClaim(
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
    bonderFee: BigNumber,
    nextHops: HopStruct[],
    overrides?: CallOverrides
  ): Promise<providers.TransactionResponse> {
    // TODO: Validation and logging
    return this.#contract.bond(
      pathId,
      claimId,
      bonderFee,
      nextHops,
      overrides
    )
  }

  async getAmountOut(
    pathId: string,
    amount: BigNumber,
    attestedClaimId: string,
    sourcePool: BigNumber,
    sourceTotalFraudulent: BigNumber
  ): Promise<BigNumber> {
    // TODO: Validation and logging
    return this.#contract.getAmountOut(
      pathId,
      amount,
      attestedClaimId,
      sourcePool,
      sourceTotalFraudulent
    )
  }

  async getPath(pathId: string): Promise<RailsPath> {
    // TODO: Validation and logging
    const pathAddress = await this.#contract.getPath(pathId)
    return getRailsPath(pathAddress, this.#contract.provider)
  }
}

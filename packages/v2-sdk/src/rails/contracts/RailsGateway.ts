import {
  type BigNumber,
  type BigNumberish,
  type providers,
  type CallOverrides,
  Contract
} from 'ethers'
import {
  type Addressish,
  type Pathish,
  getPath,
  getAddress
} from '#models/index.js'
import type { RailsGateway as RailsGatewayContract, HopStruct } from './types/index.js'
import type { RailsPath } from './RailsPath.js'
import { railsGatewayABI } from './abis/index.js'
import type { RPCClient } from '../types.js'
import { getRailsPath } from './RailsFactory.js'

export class RailsGateway {
  readonly #contract: RailsGatewayContract

  constructor(address: Addressish, rpcClient: RPCClient) {
    address = getAddress(address).toString()
    this.#contract = new Contract(address, railsGatewayABI, rpcClient) as RailsGatewayContract
  }

  async send(
    to: Addressish,
    amount: BigNumberish,
    hops: HopStruct[],
    overrides?: CallOverrides
  ): Promise<providers.TransactionResponse> {
    // TODO: Validation and logging
    return this.#contract.send(
      getAddress(to).toString(),
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
      getPath(pathId).pathId,
      claimId,
      getAddress(to).toString(),
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
      getPath(pathId).pathId,
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
      getPath(pathId).pathId,
      amount,
      attestedClaimId,
      sourcePool,
      sourceTotalFraudulent,
      overrides
    )
  }

  async getPath(pathId: Pathish, overrides?: CallOverrides): Promise<RailsPath> {
    // TODO: Validation and logging
    const pathAddress = await this.#contract.getPath(getPath(pathId).pathId, overrides)
    return getRailsPath(pathAddress, this.#contract.signer)
  }
}

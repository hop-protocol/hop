import type {
  BigNumber,
  providers,
  CallOverrides
} from 'ethers'
import { type RailsGateway as RailsGatewayType, railsGatewayABI } from './static/index.js'
import type { HopStruct } from './types.js'
import { BaseRailsContract } from './BaseRailsContract.js'
import type { RPC } from '../types.js'

export type RailsGatewayContractEvent = RailsGatewayType['interface']['events']
export type RailsGatewayContractFilter = RailsGatewayType['filters']

export class RailsGatewayContract extends BaseRailsContract<RailsGatewayType> {

  constructor(address: string, rpc?: RPC) {
    super(address, railsGatewayABI, rpc)
  }

  async send(
    to: string,
    amount: BigNumber,
    hops: HopStruct[],
    overrides?: CallOverrides
  ): Promise<providers.TransactionResponse> {
    // TODO: Validation and logging
    return this.contract.send(
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
    return this.contract.postClaim(
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
    return this.contract.bond(
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
    return this.contract.getAmountOut(
      pathId,
      amount,
      attestedClaimId,
      sourcePool,
      sourceTotalFraudulent
    )
  }

  async getPath(pathId: string): Promise<string> {
    // TODO: Validation and logging
    return this.contract.getPath(pathId)
  }

  async isPathInitialized(pathId: string): Promise<boolean> {
    // TODO: Validation and logging
    return this.contract.isPathInitialized(pathId)
  }
}

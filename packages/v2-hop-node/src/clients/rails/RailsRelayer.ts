import { getChainIdsForPaths } from './utils.js'
import { Relayer } from '#relayer/Relayer.js'
import { wallets } from '#wallets/index.js'
import {
  RailsGateway,
  RailsMethodName,
  isContractError
} from './RailsSDKWrapper.js'
import { getTxOverrides } from '#utils/getTxOverrides.js'
import {
  isValidBondTxInputData,
  isValidPushClaimTxInputData,
  isValidRemoveClaimTxInputData,
  isValidReaddClaimTxInputData
} from './utils.js'
import type {
  BondInput,
  PushClaimInput,
  RemoveClaimInput,
  ReaddClaimInput,
  RailsRelayItem
} from './types.js'
import type { providers } from 'ethers'
import type { RailsPath } from './types.js'
import type { ClientName } from '../constants.js'

export class RailsRelayer extends Relayer<RailsMethodName, RailsRelayItem> {
  readonly #railsGateways: Record<string, RailsGateway> = {}

  constructor (name: ClientName, paths: RailsPath[]) {
    super(name)
    const chainIds = getChainIdsForPaths(paths)
    for (const chainId of chainIds) {
      const wallet = wallets.get(chainId)
      this.#railsGateways[chainId] = new RailsGateway(chainId, wallet)
    }
  }

  protected override formatRelayItem(relayTxMethodName: RailsMethodName, relayItem: any): RailsRelayItem {
    switch (relayTxMethodName) {
      case RailsMethodName.Bond:
        return this.#formatBondInput(relayItem)
      case RailsMethodName.PushClaim:
        return this.#formatPushClaimInput(relayItem)
      case RailsMethodName.RemoveClaim:
        return this.#formatRemoveClaimInput(relayItem)
      case RailsMethodName.ReaddClaim:
        return this.#formatReaddClaimInput(relayItem)
      default:
        throw new Error('Invalid relay item')
    }
  }

  protected override async shouldAttemptRelay (
    relayItem: RailsRelayItem,
    relayTxMethodName: RailsMethodName,
    relayChainId: string
  ): Promise<boolean> {
    switch (relayTxMethodName) {
      case RailsMethodName.Bond:
        return this.#canRelayBond(relayItem as BondInput, relayChainId)
      case RailsMethodName.PushClaim:
        return this.#canRelayPushClaim(relayItem as PushClaimInput, relayChainId)
      // TODO
      // case RailsMethodName.RemoveClaim:
      //   return this.#canRelayRemoveClaim(relayItem as RemoveClaimInput, relayChainId)
      // case RailsMethodName.ReaddClaim:
      //   return this.#canRelayReaddClaim(relayItem as ReaddClaimInput, relayChainId)
      default:
        throw new Error('Invalid relay item')
    }
  }

  protected override isImplementationError (err: unknown): boolean {
    return (
      this.#isContractError(err) ||
      this.#isBCRError(err)
    )
  }

  /**
   * External
   */

  override async sendRelay (
    relayItem: RailsRelayItem,
    relayTxMethodName: RailsMethodName,
    relayChainId: string
  ): Promise<providers.TransactionResponse> {
    switch (relayTxMethodName) {
      case RailsMethodName.Bond:
        return this.#sendBond(relayItem as BondInput, relayChainId)
      case RailsMethodName.PushClaim:
        return this.#sendPushClaim(relayItem as PushClaimInput, relayChainId)
        // TODO
      // case RailsMethodName.RemoveClaim:
      //   return this.#sendRemoveClaim(relayItem as RemoveClaimInput, relayChainId)
      // case RailsMethodName.ReaddClaim:
      //   return this.#sendReaddClaim(relayItem as ReaddClaimInput, relayChainId)
      default:
        throw new Error('Invalid relay item')
    }
  }

  /**
   * Internal - Validation
   */

  async #canRelayPushClaim (relayItem: PushClaimInput, relayChainId: string): Promise<boolean> {
    const gateway = this.#railsGateways[relayChainId]
    if (typeof gateway === 'undefined') {
      throw new Error(`No gateway found for chainId: ${relayChainId}`)
    }

    const { pathId, claimId } = relayItem
    const isPushed = await gateway.isPushed(pathId, claimId)
    const isBonded = await gateway.isBonded(pathId, claimId)
    return !isPushed && !isBonded
  }

  async #canRelayBond (relayItem: BondInput, relayChainId: string): Promise<boolean> {
    const gateway = this.#railsGateways[relayChainId]
    if (typeof gateway === 'undefined') {
      throw new Error(`No gateway found for chainId: ${relayChainId}`)
    }

    const { pathId, claimId } = relayItem
    const isPushed = await gateway.isPushed(pathId, claimId)
    const isBonded = await gateway.isBonded(pathId, claimId)
    // TODO: If this is true, should we throw?
    return isPushed && !isBonded
  }

  /**
   * Internal - Execution
   */

  async #sendBond (relayItem: BondInput, relayChainId: string): Promise<providers.TransactionResponse> {
    const txOverrides = await getTxOverrides(relayChainId)
    const gateway = this.#railsGateways[relayChainId]
    if (typeof gateway === 'undefined') {
      throw new Error(`No gateway found for chainId: ${relayChainId}`)
    }
    return gateway.bond(relayItem, txOverrides)
  }

  async #sendPushClaim (relayItem: PushClaimInput, relayChainId: string): Promise<providers.TransactionResponse> {
    const txOverrides = await getTxOverrides(relayChainId)
    const gateway = this.#railsGateways[relayChainId]
    if (typeof gateway === 'undefined') {
      throw new Error(`No gateway found for chainId: ${relayChainId}`)
    }
    return gateway.pushClaim(relayItem, txOverrides)
  }

  /**
   * Internal - Format
   */

  #formatBondInput (relayItem: any): BondInput{
    const isValid = isValidBondTxInputData(relayItem)
    if (!isValid) {
      throw new Error('Invalid bond input')
    }

    return {
      pathId: relayItem.pathId,
      claimId: relayItem.claimId,
      bonderFee: relayItem.bonderFee,
      nextHops: relayItem.nextHops
    }
  }

  #formatPushClaimInput (relayItem: any): PushClaimInput {
    const isValid = isValidPushClaimTxInputData(relayItem)
    if (!isValid) {
      throw new Error('Invalid push claim input')
    }
    return {
      pathId: relayItem.pathId,
      claimId: relayItem.claimId,
      to: relayItem.to,
      amount: relayItem.amount,
      maxBonderFee: relayItem.maxBonderFee,
      attestedClaimId: relayItem.attestedClaimId,
      sourcePool: relayItem.sourcePool,
      nextHopsHash: relayItem.nextHopsHash,
    }
  }

  #formatRemoveClaimInput (relayItem: any): RemoveClaimInput {
    const isValid = isValidRemoveClaimTxInputData(relayItem)
    if (!isValid) {
      throw new Error('Invalid remove claim input')
    }
    return {
      pathId: relayItem.pathId,
      claimId: relayItem.claimId
    }
  }

  #formatReaddClaimInput (relayItem: any): ReaddClaimInput {
    const isValid = isValidReaddClaimTxInputData(relayItem)
    if (!isValid) {
      throw new Error('Invalid readd claim input')
    }
    return {
      pathId: relayItem.pathId,
      claimId: relayItem.claimId
    }
  }

  /**
   * Errors
   */

  #isContractError (err: unknown): boolean {
    if (isContractError(err)) {
      return true
    }
    return true
  }

  #isBCRError (err: unknown): boolean {
    // if (err instanceof BonderChoiceRule.BCRError) {
    //   return true
    // }
    // return false
    return true
  }
}

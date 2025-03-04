import { getChainIdsForPaths } from './utils.js'
import { Relayer } from '#relayer/Relayer.js'
import { wallets } from '#wallets/index.js'
import { RailsGateway, isContractError } from './RailsSDKWrapper.js'
import { getTxOverrides } from '#utils/getTxOverrides.js'
import { isBondTxInputData, isPostClaimTxInputData } from './utils.js'
import type { BondInput, PostClaimInput, RailsRelayItem } from './types.js'
import type { providers } from 'ethers'
import type { RailsPath } from './types.js'
import type { ClientName } from '../constants.js'

export class RailsRelayer extends Relayer<RailsRelayItem> {
  readonly #railsGateways: Record<string, RailsGateway> = {}

  constructor (name: ClientName, paths: RailsPath[]) {
    super(name)
    const chainIds = getChainIdsForPaths(paths)
    for (const chainId of chainIds) {
      const wallet = wallets.get(chainId)
      this.#railsGateways[chainId] = new RailsGateway(chainId, wallet)
    }
  }

  protected override async shouldAttemptRelay (relayItem: RailsRelayItem): Promise<boolean> {
    const { relayChainId } = relayItem
    if (isBondTxInputData(relayItem)) {
      return this.#canRelayBond(relayItem, relayChainId)
    // TODO: Why did I do not?
    } else if (!isPostClaimTxInputData(relayItem)) {
      return this.#canRelayPostClaim(relayItem, relayChainId)
    }

    throw new Error('Invalid relay item')
  }

  protected override async sendRelay (relayItem: RailsRelayItem): Promise<providers.TransactionResponse> {
    // TODO: possibly validate BCR here to avoid a bad bond
    const { relayChainId } = relayItem

    if (isBondTxInputData(relayItem)) {
      return this.#sendBond(relayItem, relayChainId)
    // TODO: Why did I do not?
    } else if (!isPostClaimTxInputData(relayItem)) {
      return this.#sendPostClaim(relayItem, relayChainId)
    }

    throw new Error('Invalid relay item')
  }

  protected override isImplementationError (err: unknown): boolean {
    return (
      this.#isContractError(err) ||
      this.#isBCRError(err)
    )
  }

  /**
   * Internal - Validation
   */

  async #canRelayBond (relayItem: BondInput, relayChainId: string): Promise<boolean> {
    const gateway = this.#railsGateways[relayChainId]
    if (typeof gateway === 'undefined') {
      throw new Error(`No gateway found for chainId: ${relayChainId}`)
    }

    const isClaimed = await gateway.isClaimed(relayItem.claimId)
    const isBonded = await gateway.isBonded(relayItem.claimId)
    return isClaimed && !isBonded
  }

  async #canRelayPostClaim (relayItem: PostClaimInput, relayChainId: string): Promise<boolean> {
    const gateway = this.#railsGateways[relayChainId]
    if (typeof gateway === 'undefined') {
      throw new Error(`No gateway found for chainId: ${relayChainId}`)
    }

    const isPosted = await gateway.isPosted(relayItem.transferId)
    // TODO: If this is true, should we throw?
    return !isPosted
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

  async #sendPostClaim (relayItem: PostClaimInput, relayChainId: string): Promise<providers.TransactionResponse> {
    const txOverrides = await getTxOverrides(relayChainId)
    const gateway = this.#railsGateways[relayChainId]
    if (typeof gateway === 'undefined') {
      throw new Error(`No gateway found for chainId: ${relayChainId}`)
    }
    return gateway.pushClaim(relayItem, txOverrides)
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

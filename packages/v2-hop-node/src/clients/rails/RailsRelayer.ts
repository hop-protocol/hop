import { getChainIdsForPaths, getPathFromPathId } from './utils.js'
import { Relayer } from '#relayer/Relayer.js'
import { wallets } from '#wallets/index.js'
import { RailsGateway, isContractError } from './RailsSDKWrapper.js'
import { getTxOverrides } from '#utils/getTxOverrides.js'
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
    if (this.#isBondInput(relayItem)) {
      return this.#canRelayBond(relayItem, relayChainId)
    } else if (!this.#isPostClaimInput(relayItem)) {
      return this.#canRelayPostClaim(relayItem, relayChainId)
    }

    throw new Error('Invalid relay item')
  }

  protected override async sendRelay (relayItem: RailsRelayItem): Promise<providers.TransactionResponse> {
    // TODO: possibly validate BCR here to avoid a bad bond
    const { relayChainId } = relayItem

    if (this.#isBondInput(relayItem)) {
      return this.#sendBond(relayItem, relayChainId)
    } else if (!this.#isPostClaimInput(relayItem)) {
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

    // TODO: Fix this
    const a: any = {}
    return gateway.bond(a, txOverrides)
  }

  async #sendPostClaim (relayItem: PostClaimInput, relayChainId: string): Promise<providers.TransactionResponse> {
    const { pathId, transferId, to, amountOut, maxBonderFee, attestedClaimId, totalSent, totalClaims, nextHopsHash } = relayItem
    const txOverrides = await getTxOverrides(relayChainId)
    const gateway = this.#railsGateways[relayChainId]
    if (typeof gateway === 'undefined') {
      throw new Error(`No gateway found for chainId: ${relayChainId}`)
    }

    // TODO: Fix this
    const a: any = {}
    return gateway.postClaim(a, txOverrides)
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

  /**
   * Type Guards
   */

  #isBondInput(item: unknown): item is BondInput {
    if (typeof item !== 'object' || item === null) {
      return false
    }

    const candidate = item as Partial<BondInput>
    return (
      'pathId' in candidate &&
      'transferId' in candidate &&
      'nextHops' in candidate &&
      typeof candidate.pathId === 'string' &&
      typeof candidate.transferId === 'string' &&
      Array.isArray(candidate.nextHops)
      // NOTE: This does not validate the nextHops array. It is assumed that the
      // array is correctly formatted
    )
  }

  // TODO: The BigNumberish types should be checked for correctness. Possibly introduce isBigNumberish
  #isPostClaimInput(item: unknown): item is PostClaimInput {
    if (typeof item !== 'object' || item === null) {
      return false
    }

    const candidate = item as Partial<PostClaimInput>
    return (
      'pathId' in candidate &&
      'transferId' in candidate &&
      'to' in candidate &&
      'amount' in candidate &&
      'totalSent' in candidate &&
      'attestedClaimId' in candidate &&
      'attestedTotalClaims' in candidate &&
      'nextHopsHash' in candidate &&
      typeof candidate.pathId === 'string' &&
      typeof candidate.transferId === 'string' &&
      typeof candidate.to === 'string' &&
      // typeof candidate.amount?.toString() === 'string' &&
      // typeof candidate.totalSent?.toString() === 'string' &&
      typeof candidate.attestedClaimId === 'string' &&
      // typeof candidate.attestedTotalClaims?.toString() === 'string' &&
      typeof candidate.nextHopsHash === 'string'
    )
  }
}

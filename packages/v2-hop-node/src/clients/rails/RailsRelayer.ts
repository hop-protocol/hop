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
    if (this.#isBondInput(relayItem)) {
      return this.#canRelayBond(relayItem as BondInput)
    } else if (!this.#isPostClaimInput(relayItem)) {
      return this.#canRelayPostClaim(relayItem as PostClaimInput)
    }

    throw new Error('Invalid relay item')
  }

  protected override async sendRelay (relayItem: RailsRelayItem): Promise<providers.TransactionResponse> {
    // TODO: possibly validate BCR here to avoid a bad bond

    if (this.#isBondInput(relayItem)) {
      return this.#sendBond(relayItem)
    } else if (!this.#isPostClaimInput(relayItem)) {
      return this.#sentPostClaim(relayItem)
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

  async #canRelayBond (relayItem: BondInput): Promise<boolean> {
    const { pathId } = relayItem
    const { destChainId } = getPathFromPathId(pathId)
    const gateway = this.#railsGateways[destChainId]
    if (typeof gateway === 'undefined') {
      throw new Error(`No gateway found for chainId: ${destChainId}`)
    }

    const isClaimed = await gateway.isClaimed(relayItem.transferId)
    const isBonded = await gateway.isBonded(relayItem.transferId)
    return isClaimed && !isBonded
  }

  async #canRelayPostClaim (relayItem: PostClaimInput): Promise<boolean> {
    const { pathId } = relayItem
    const { destChainId } = getPathFromPathId(pathId)
    const gateway = this.#railsGateways[destChainId]
    if (typeof gateway === 'undefined') {
      throw new Error(`No gateway found for chainId: ${destChainId}`)
    }

    const isPosted = await gateway.isPosted(relayItem.transferId)
    // TODO: If this is true, should we throw?
    return !isPosted
  }

  /**
   * Internal - Execution
   */

  async #sendBond (relayItem: BondInput): Promise<providers.TransactionResponse> {
    const { pathId, transferId, nextHops } = relayItem
    const { destChainId } = getPathFromPathId(pathId)
    const txOverrides = await getTxOverrides(destChainId)
    const gateway = this.#railsGateways[destChainId]
    if (typeof gateway === 'undefined') {
      throw new Error(`No gateway found for chainId: ${destChainId}`)
    }

    const a: any = {}
    return gateway.bond(a, txOverrides)
  }

  async #sentPostClaim (relayItem: PostClaimInput): Promise<providers.TransactionResponse> {
    const { pathId, transferId, to, amount, totalSent, attestedClaimId, attestedTotalClaims, nextHopsHash } = relayItem
    const { destChainId } = getPathFromPathId(pathId)
    const txOverrides = await getTxOverrides(destChainId)
    const gateway = this.#railsGateways[destChainId]
    if (typeof gateway === 'undefined') {
      throw new Error(`No gateway found for chainId: ${destChainId}`)
    }

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

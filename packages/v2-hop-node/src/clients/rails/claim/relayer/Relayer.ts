import { getPathFromPathId } from '../../utils.js'
import { Relayer } from '#relayer/Relayer.js'
import { wallets } from '#wallets/index.js'
import { RailsSDKWrapper, RailsSDK } from '../../RailsSDKWrapper.js'
import type { PostClaimInput, IRailsClaimRelayItem } from './types.js'
import type { Signer, providers } from 'ethers'

export class RailsClaimRelayer extends Relayer<IRailsClaimRelayItem> {

  /**
   * Implementation
   */

  protected override async shouldAttemptRelay (relayItem: IRailsClaimRelayItem): Promise<boolean> {
    if (!this.#isPostClaimInput(relayItem)) {
      throw new Error('Invalid relay item')
    }
    return this.#canRelayPostClaim(relayItem as PostClaimInput)
  }

  protected override async sendRelay (relayItem: IRailsClaimRelayItem): Promise<providers.TransactionResponse> {
    if (!this.#isPostClaimInput(relayItem)) {
      throw new Error('Invalid relay item')
    }
    return this.#sentPostClaim(relayItem)
  }

  protected override isImplementationError (err: unknown): boolean {
    return this.#isContractError(err)
  }

  /**
   * Internal - Validation
   */

  async #canRelayPostClaim (relayItem: PostClaimInput): Promise<boolean> {
    const isPosted = await RailsSDK.isPosted(relayItem.transferId)
    // TODO: If this is true, should we throw?
    return !isPosted
  }

  /**
   * Internal - Execution
   */

  async #sentPostClaim (relayItem: PostClaimInput): Promise<providers.TransactionResponse> {
    const { pathId, transferId, to, amount, totalSent, attestedClaimId, attestedTotalClaims, nextHopsHash } = relayItem
    const wallet = this.#getWalletFromPathId(pathId)
    // TODO: SDK: Connect when available
    return RailsSDKWrapper/*.connect(wallet)*/.postClaim({
      pathId,
      transferId,
      to,
      amount,
      totalSent,
      attestedClaimId,
      attestedTotalClaims,
      nextHopsHash
    })
  }

  /**
   * Type Guards
   */

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

  /**
   * Errors
   */

  #isContractError (err: unknown): boolean {
    const errMessage = (err as Error).message
    // TODO
    return true
  }

  /**
   * Utils
   */

  #getWalletFromPathId (pathId: string): Signer {
    // A transaction is never sent on the source chain, so the destination chain is used
    const { destChainId } = getPathFromPathId(pathId)
    return wallets.get(destChainId)
  }
}

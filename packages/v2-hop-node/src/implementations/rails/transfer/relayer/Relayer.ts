import { getPathFromPathId } from '../utils.js'
import { Relayer } from '#relayer/Relayer.js'
import { wallets } from '#wallets/index.js'
import { RailsSDKWrapper, RailsSDK } from '../../RailsSDKWrapper.js'
import type { BondInput, IRailsTransferRelayItem } from './types.js'
import type { Signer, providers } from 'ethers'
// import { BonderChoiceRule } from '#bcr/BonderChoiceRule.js'

export class RailsTransferRelayer extends Relayer<IRailsTransferRelayItem> {

  /**
   * Implementation
   */

  protected override shouldAttemptRelay (relayItem: IRailsTransferRelayItem): Promise<boolean> {
    if (!this.#isBondInput(relayItem)) {
      throw new Error('Invalid relay item')
    }
    return this.#canRelaySentTransfer(relayItem as BondInput)
  }

  protected override sendRelay (relayItem: IRailsTransferRelayItem): Promise<providers.TransactionResponse> {

    // TODO: possibly validate BCR here to avoid a bad bond

    if (!this.#isBondInput(relayItem)) {
      throw new Error('Invalid relay item')
    }
    return this.#sendBond(relayItem)
  }

  isImplementationError (relayItem: IRailsTransferRelayItem, err: Error): boolean {
    return (
      this.#isContractError(relayItem, err) ||
      this.#isBCRError(relayItem, err)
    )
  }

  /**
   * Internal - Validation
   */

  async #canRelaySentTransfer (relayItem: BondInput): Promise<boolean> {
    const isClaimed = await RailsSDK.isClaimed(relayItem.transferId)
    const isBonded = await RailsSDK.isBonded(relayItem.transferId)
    return isClaimed && !isBonded
  }

  /**
   * Internal - Execution
   */

  async #sendBond (relayItem: BondInput): Promise<providers.TransactionResponse> {
    const { pathId, transferId, nextHops } = relayItem as BondInput
    const wallet = this.#getWalletFromPathId(pathId)
    // TODO: SDK: Connect when available
    return RailsSDKWrapper/*.connect(wallet)*/.bond({
      pathId,
      transferId,
      nextHops
    })
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

  /**
   * Errors
   */

  #isContractError (relayItem: BondInput, err: Error): boolean {
    // TODO
    return true
  }

  #isBCRError (relayItem: BondInput, err: Error): boolean {
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

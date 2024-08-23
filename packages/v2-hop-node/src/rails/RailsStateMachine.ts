import { wallets } from '#wallets/index.js'
import { getChain } from '@hop-protocol/sdk'
import { RailsSDKWrapper, RailsSDK } from './RailsSDK.js'
import { BonderChoiceRule } from '#bcr/BonderChoiceRule.js'
import { StateMachine } from '#state-machine/StateMachine.js'
import { poll } from '#utils/poll.js'
import {
  type ISentRailsTransfer,
  type IPostedRailsTransfer,
  type IRailsTransfer,
  type RailsHop,
  RailsTransferState
} from './types.js'
import { TxRelayDB } from '#db/TxRelayDB.js'
import { FINALITY_TIME_MS } from '#constants/index.js'
import type { providers } from 'ethers'
import { getChainsFromPathId } from './utils.js'

export class RailsStateMachine extends StateMachine<RailsTransferState, IRailsTransfer> {
  readonly #relayedTxCache: TxRelayDB = new TxRelayDB('StateMachine')
  // If timing checks pass, a relay is attempted every poll. This value should be small enough
  // where users are not waiting a relatively long time but short enough where resources (RPC calls,
  // attestation API calls) are not abused.
  readonly #pollIntervalMs: number = 60_000

  override start(): void {
    super.start()
    this.#startPollers()
  }

  #startPollers (): void {
    void poll(() => this.#pollRelayer(RailsTransferState.Sent), this.#pollIntervalMs, this.logger)
    void poll(() => this.#pollRelayer(RailsTransferState.Posted), this.#pollIntervalMs, this.logger)
  }

  /**
   * Implementation
   */

  protected override getItemId(value: IRailsTransfer): string {
    return value.transferId
  }

  protected override shouldAttemptTransition(state: RailsTransferState, value: IRailsTransfer): boolean {
    switch (state) {
      case RailsTransferState.Sent:
        return this.#isPostFinalized(value as ISentRailsTransfer)
      case RailsTransferState.Posted:
        return this.#shouldBondBeFinalized(value as IPostedRailsTransfer)
      default:
        throw new Error('Invalid state')
    }
  }

  /**
   * FSM Utils
   */

  #isPostFinalized(value: ISentRailsTransfer): boolean {
    // A post can be finalized if enough time has passed for the send to
    // be finalized on the source chain, for the bonder to post the claim,
    // and for the post to be finalized on the destination chain.
    const { pathId, sentTimestampMs } = value

    const { srcChainId, destChainId } = getChainsFromPathId(pathId)
    const srcChainSlug = getChain(srcChainId).slug
    const srcChainFinalityTimeMs = FINALITY_TIME_MS[srcChainSlug]
    const destChainSlug = getChain(destChainId).slug
    const destChainFinalityTimeMs = FINALITY_TIME_MS[destChainSlug]

    const expectedRelayTimeMs =
      sentTimestampMs +
      srcChainFinalityTimeMs +
      destChainFinalityTimeMs

    const relayFinalizedTimestampOk = expectedRelayTimeMs < Date.now()

    return (
      relayFinalizedTimestampOk
    )
  }

  #shouldBondBeFinalized(value: IPostedRailsTransfer): boolean {
    // A bond can be finalized if enough time has passed for the post to
    // be finalized on its own chain, for the bonder to bond the claim,
    // and for the bond to be finalized on its own chain.
    const { pathId, postedTimestampMs } = value

    const { destChainId } = getChainsFromPathId(pathId)
    const destChainSlug = getChain(destChainId).slug
    const destChainFinalityTimeMs = FINALITY_TIME_MS[destChainSlug]

    // We add the finality time twice because both the post and the claim
    // must be finalized and they exist on the same chain.
    const expectedRelayTimeMs =
      postedTimestampMs +
      destChainFinalityTimeMs +
      destChainFinalityTimeMs

    const relayFinalizedTimestampOk = expectedRelayTimeMs < Date.now()

    return (
      relayFinalizedTimestampOk
    )
  }

  /**
   * Relayer
   */

  #pollRelayer = async (state: RailsTransferState): Promise<void> => {
    for await (const [, value] of this.getItemsInState(state)) {
      const canRelay = await this.#canRelayTransfer(state, value)
      if (!canRelay) continue

      await this.#relayTransfer(state, value)
    }
  }

  #canRelayTransfer (state: RailsTransferState, value: IRailsTransfer): Promise<boolean> {
    // TODO: Consider checking for gas here. Might be better handled in gasboost
    switch (state) {
      case RailsTransferState.Sent:
        return this.#canRelaySentTransfer(value as ISentRailsTransfer)
      case RailsTransferState.Posted:
        return this.#canRelayPostedTransfer(value as IPostedRailsTransfer)
      default:
        throw new Error('Invalid state')
    }
  }

  async #canRelaySentTransfer (value: ISentRailsTransfer): Promise<boolean> {
    // A transfer is postable if the bonder is chosen by the BCR
    // TODO: V2: When relayer is ripped out, create #wallet class var that is used throughout
    const { pathId, transferId } = value
    const { destChainId } = getChainsFromPathId(pathId)
    const chainSlug = getChain(destChainId).slug
    const wallet = wallets.get(chainSlug)
    return BonderChoiceRule.isTransferForBonder(transferId, pathId, await wallet.getAddress())
  }

  async #canRelayPostedTransfer (value: IPostedRailsTransfer): Promise<boolean> {
    const isClaimed = await RailsSDK.isClaimed(value.transferId)
    const isBonded = await RailsSDK.isBonded(value.transferId)
    return isClaimed && !isBonded
  }

  async #relayTransfer (state: RailsTransferState, value: IRailsTransfer,): Promise<void> {
    // Both the state and transferId are required as a unique key for the cache
    const { transferId, pathId } = value
    const cacheKey = state + transferId
    if (await this.#relayedTxCache.doesItemExist(cacheKey)) return

    const { destChainId } = getChainsFromPathId(pathId)
    this.logger.info(`Relaying transferId: ${transferId} to chain: ${destChainId}, state: ${state}`)

    try {
      // Add the item to the cache at the last possible moment prior to relaying
      await this.#relayedTxCache.addItem(cacheKey)
      // TODO: V2: Handle the case where the transaction is dropped...this should possibly be a guarantee of the signer though
      // If it is not guaranteed, then this will not re-do the transaction due to the tx being in the cache. Consider
      // adding a timing element like v1.
      await this.#sendRelay(state, value)
    } catch (err) {
      this.#handleRelayError(value, err.message)
    }
  }

  async #sendRelay (state: RailsTransferState, value: IRailsTransfer): Promise<providers.TransactionResponse> {
    const { pathId } = value
    const { destChainId } = getChainsFromPathId(pathId)

    const chainSlug = getChain(destChainId).slug
    const wallet = wallets.get(chainSlug)

    switch (state) {
      case RailsTransferState.Sent: {
        const { pathId, transferId, to, amount, totalSent, attestedClaimId, attestedTotalClaims, nextHops } = value as ISentRailsTransfer
        // TODO: Connect when available
        return RailsSDKWrapper/*.connect(wallet)*/.postClaim({
          pathId,
          transferId,
          to,
          amount,
          totalSent,
          attestedClaimId,
          attestedTotalClaims,
          nextHopsHash: RailsSDK.getNextHopsHash(nextHops)
        })
      }

      case RailsTransferState.Posted: {
        const { pathId, transferId } = value as IPostedRailsTransfer
        const nextHops: RailsHop[] = await this.getItemAttribute<ISentRailsTransfer, 'nextHops'>(value, 'nextHops')
        // TODO: Connect when available
        return RailsSDKWrapper/*.connect(wallet)*/.bond({
          pathId,
          transferId,
          nextHops
        })
      }
      default:
        throw new Error('Invalid state')
    }
  }

  #handleRelayError (value: IRailsTransfer, errMessage: string): void {
    // TODO: Fill this in when contract errors are finalized
  }
}

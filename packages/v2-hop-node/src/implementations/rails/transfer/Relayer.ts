import {
  type IRailsTransfer,
  type ISentRailsTransfer,
  type IBondedRailsTransfer,
  RailsTransferState
} from './types.js'
import type { Signer, providers } from 'ethers'
import { getPathFromPathId } from '../utils.js'
import { Relayer } from '#relayer/Relayer.js'
import { wallets } from '#wallets/index.js'
import { RailsSDKWrapper, RailsSDK } from '../RailsSDK.js'
// import { BonderChoiceRule } from '#bcr/BonderChoiceRule.js'
import type { IStateMachine } from '#state-machine/index.js'

export class RailsTransferRelayer extends Relayer<IRailsTransfer> {
  readonly #relayerDataSource: IStateMachine<IRailsTransfer>

  constructor (
    dbName: string,
    relayerDataSource: IStateMachine<IRailsTransfer>
  ) {
    super(dbName)
    this.#relayerDataSource = relayerDataSource
  }

  /**
   * Implementation
   */

  protected override getUniqueRelayId(value: IRailsTransfer): string {
    // Both the state and transferId are required as a unique key for the cache
    // since the transferId is not unique across states.
    const state = this.#getStateFromItem(value)
    return state + value.transferId
  }

  protected override async *getRelayableItems(): AsyncIterable<IRailsTransfer> {
    yield* this.#relayerDataSource.getItemsInProgress()
  }

  protected override shouldAttemptRelay (value: IRailsTransfer): Promise<boolean> {
    const state = this.#getStateFromItem(value)
    switch (state) {
      case RailsTransferState.Sent:
        return this.#canRelaySentTransfer(value as ISentRailsTransfer)
      default:
        throw new Error('Invalid state')
    }
  }

  protected override sendRelay (value: IRailsTransfer): Promise<providers.TransactionResponse> {
    const state = this.#getStateFromItem(value)

    // TODO: possibly validate BCR here to avoid a bad bond

    switch (state) {
      case RailsTransferState.Sent:
        return this.#sendBond(value as ISentRailsTransfer)
      default:
        throw new Error('Invalid state')
    }
  }

  handleOnchainRelayError (value: IRailsTransfer, errMessage: string): void {
    // TODO: Fill this in when contract errors are finalized
    // * onchain errors
    //   * this includes onchain errors during transaction simulation
  }

  /**
   * Internal - Validation
   */

  async #canRelaySentTransfer (value: ISentRailsTransfer): Promise<boolean> {
    const isClaimed = await RailsSDK.isClaimed(value.transferId)
    const isBonded = await RailsSDK.isBonded(value.transferId)
    return isClaimed && !isBonded
  }

  /**
   * Internal - Execution
   */

  async #sendBond (value: ISentRailsTransfer): Promise<providers.TransactionResponse> {
    const { pathId, transferId, nextHops } = value as ISentRailsTransfer
    const wallet = this.#getWalletFromPathId(pathId)
    // TODO: SDK: Connect when available
    return RailsSDKWrapper/*.connect(wallet)*/.bond({
      pathId,
      transferId,
      nextHops
    })
  }

  /**
   * Utils
   */

  #getWalletFromPathId (pathId: string): Signer {
    // A transaction is never sent on the source chain, so the destination chain is used
    const { destChainId } = getPathFromPathId(pathId)
    return wallets.get(destChainId)
  }

  #getStateFromItem (value: IRailsTransfer): RailsTransferState {
    // The order does not matter since the value will only be in one state at a time.
    switch (true) {
      case !!(value as ISentRailsTransfer).sentTxHash === true:
        return RailsTransferState.Sent
      case !!(value as IBondedRailsTransfer).bondedTxHash === true:
        return RailsTransferState.Bonded
      default:
        throw new Error('Invalid state')
    }
  }
}

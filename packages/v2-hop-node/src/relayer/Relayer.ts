import { poll } from '#utils/poll.js'
import { Logger } from '#logger/index.js'
import { RelayerDB } from '#db/RelayerDB.js'
import {
  NonceTooLowError,
  InsufficientFundsError,
  EstimateGasError
} from '#types/index.js'
import type { IRelayer } from './IRelayer.js'
import type { providers } from 'ethers'

/**
 * Relayer is concerned with relaying transactions. It allows for validation of transactions
 * before and after they are sent.
 *
 * A cache is used to track onchain transactions that have been relayed and to avoid
 * the relaying of a transaction that has already been relayed.
 *
 * @dev Transactions should only be sent here if they are ready to be relayed. This class
 * will consume RPC calls to validate onchain state, so it should be used sparingly.
 */

export abstract class Relayer<RelayItem> implements IRelayer<RelayItem> {
  readonly #db: RelayerDB<RelayItem>
  // This poller is what relays transactions. The main resource consumed per poll is onchain calls,
  // which can be heavy if left unchecked. If this poller is too short, too many RPC calls
  // may be made for an unexpected transaction and cause exhaustion of resources. If the poller
  // is too long, users will have to wait longer for their transactions to be relayed. A one
  // minute poller is a good balance between the two.
  readonly #pollIntervalMs: number = 60_000
  protected readonly logger: Logger

  protected abstract shouldAttemptRelay(value: RelayItem): Promise<boolean>
  protected abstract sendRelay(value: RelayItem): Promise<providers.TransactionResponse>
  protected abstract isContractError(value: RelayItem, errMessage: Error): boolean

  constructor (dbName: string) {
    this.#db = new RelayerDB(dbName)
    this.logger = new Logger({
      tag: 'Relayer',
      color: 'gray'
    })
  }

  /**
   * Initialization
   */

  start (): void {
    this.#startPoller()
    this.logger.info('Relayer started')
  }

  /**
   * Poller
   */

  #startPoller (): void {
    void poll(() => this.#checkRelay(), this.#pollIntervalMs, this.logger)
  }

  #checkRelay = async (): Promise<void> => {
    for await (const relayItem of this.#db.getRelayableItems()) {
      // Check if the item is ready to be attempted
      const canRelay = await this.shouldAttemptRelay(relayItem)
      if (!canRelay) return

      await this.#db.updateRelayTime(relayItem)
      await this.#attemptRelay(relayItem)
    }
  }

  /**
   * Relay
   */

  // The concept of relaying in this class means to add it to the cache
  // and let the poller send it.
  async relay (relayItem: RelayItem): Promise<void> {
    await this.#db.addItem(relayItem)
  }

  /**
   * Internal
   */

  async #attemptRelay (relayItem: RelayItem): Promise<providers.TransactionResponse | void> {
    try {
      this.logger.info(`Relaying item: ${JSON.stringify(relayItem)}`)
      return await this.sendRelay(relayItem)
    } catch (err) {
      return this.#handleRelayError(relayItem, err.message)
    }
  }

  async #handleRelayError (relayItem: RelayItem, err: Error): Promise<void> {
    const errType = this.#getErrFromErr(err)
    const stringifiedItem = JSON.stringify(relayItem)

    // Contract errors
    // An error should not get here since it should be handled in shouldAttemptRelay.
    // If an error does get here, the concrete implementation should be updated.
    if (this.isContractError(relayItem, err)) {
      this.logger.debug(`Onchain relay error for item: ${stringifiedItem}. The item will not be attempted again.`)
      return this.#db.removeItem(relayItem)
    }

    // Tx errors
    if (errType === NonceTooLowError) {
      // This may occur if there are multiple servers running at once.
      // This item is removed from the cache so it can be reattempted.
      this.logger.debug(`Nonce already used for item: ${stringifiedItem}. The item will be attempted again.`)
      return this.#db.resetRelayTime(relayItem)
    } else if (errType === EstimateGasError) {
      // TODO: Higher level
      // TODO: Probably some higher order blocking since this will continue to fail. Kick out of BCR
    } else if (errType === InsufficientFundsError) {
      // TODO: Higher level
      // TODO: Probably some higher order blocking since this will continue to fail. Kick out of BCR
      return
    } else {
      // For each
      // * Handle in DB
      // * Handle in top-level
      //
      // TODO: GasBoost errors
      // * OOG
      // * Max rebroadcast
      // * Transaction replaced
      // * Transaction dropped
      // * Transaction hangs
      // * Reorg (though I think it might be handled by replace/drop/hang
      // * chain issues (look at historical experience)
      // * timeout
      // * RPC server error
      // * Anything else?
    }
  }

  // TODO: This should be owned by gasBoost
  #getErrFromErr(err: Error): any {
    if (err instanceof NonceTooLowError) {
      return NonceTooLowError
    } else if (err instanceof EstimateGasError) {
      return EstimateGasError
    } else if (/insufficient/g.test(err.message)) {
      return InsufficientFundsError
    }
  }
}

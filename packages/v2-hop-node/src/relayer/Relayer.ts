import { poll } from '#utils/poll.js'
import { Logger } from '#logger/index.js'
import { TxRelayDB } from '#db/TxRelayDB.js'
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
  readonly #relayedTxCache: TxRelayDB
  // This poller is what relays transactions. The main resource consumed per poll is onchain calls,
  // which can be heavy if left unchecked. If this poller is too short, too many RPC calls
  // may be made for an unexpected transaction and cause exhaustion of resources. If the poller
  // is too long, users will have to wait longer for their transactions to be relayed. A one
  // minute poller is a good balance between the two.
  readonly #pollIntervalMs: number = 60_000
  protected readonly logger: Logger

  protected abstract getUniqueRelayId(value: RelayItem): string
  protected abstract getRelayableItems(): AsyncIterable<RelayItem>
  protected abstract sendRelay(value: RelayItem): Promise<providers.TransactionResponse>
  protected abstract shouldAttemptRelay(value: RelayItem): Promise<boolean>
  protected abstract handleRelayError(value: RelayItem, errMessage: string): void

  constructor (dbName: string) {
    this.#relayedTxCache = new TxRelayDB(dbName)
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
    for await (const relayItem of this.getRelayableItems()) {
      const canRelay = await this.shouldAttemptRelay(relayItem)
      if (!canRelay) continue

      await this.#sendRelay(relayItem)
    }
  }

  /**
   * Relay
   */

  async #sendRelay (relayItem: RelayItem): Promise<providers.TransactionResponse | void> {
    const cacheKey = this.getUniqueRelayId(relayItem)
    if (await this.#relayedTxCache.doesItemExist(cacheKey)) return

    this.logger.info(`Relaying item with cache: ${cacheKey}`)
    try {
      // Add the item to the cache at the last possible moment prior to relaying
      await this.#relayedTxCache.addItem(cacheKey)
      return await this.sendRelay(relayItem)
    } catch (err) {
      this.#handleRelayError(relayItem, err.message)
    }
  }

  #handleRelayError (relayItem: RelayItem, errMessage: string): void {
      // Cases:
        // * (Parent class) Tx fails onchain
        // * Server restarts
        // * Tx is dropped from mempool / nonce reused
        // * Tx is never mined
        // * OOG
        // * (anything else)
      // TODO: V2: Handle the case where the transaction is dropped...this should possibly be a guarantee of the signer though
      // If it is not guaranteed, then this will not re-do the transaction due to the tx being in the cache. Consider
      // adding a timing element like v1.

      // TODO: V2: then update CCTP
  }
}

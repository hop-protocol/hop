import { poll } from '#utils/poll.js'
import { Logger } from '#logger/index.js'
import { RelayerDB } from './RelayerDB.js'
import { isEVMError } from '#gasboost/index.js'
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

export abstract class Relayer<RelayItem extends object> implements IRelayer<RelayItem> {
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
  protected abstract isImplementationError(err: unknown): boolean

  constructor (name: string) {
    this.#db = new RelayerDB(name)
    const tag = name + 'Relayer'
    this.logger = new Logger({
      tag,
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
      const canRelay = await this.shouldAttemptRelay(relayItem)
      if (!canRelay) return

      await this.#db.addRelayAttempt(relayItem)

      // Do not await this. We do not want to block the execution of
      // transactions. The relayItem will not continue to poll the
      // same relayItem until this method is resolved, so we don't
      // care if it is awaited.
      void this.#attemptRelay(relayItem)
    }
  }

  /**
   * Relay
   */

  async relay (relayItem: RelayItem): Promise<void> {
    this.logger.info(`Adding item to relay: ${JSON.stringify(relayItem)}`)
    await this.#db.addItem(relayItem)
  }

  /**
   * Internal
   */

  async #attemptRelay (relayItem: RelayItem): Promise<void> {
    this.logger.info(`Relaying item: ${JSON.stringify(relayItem)}`)
    try {
      await this.sendRelay(relayItem)
      await this.#db.removeItem(relayItem)
    } catch (err: unknown) {
      return this.#handleRelayError(relayItem, err)
    }
  }

  async #handleRelayError (relayItem: RelayItem, err: unknown): Promise<void> {
    const stringifiedItem = JSON.stringify(relayItem)

    // An error should not get here since it should be handled in shouldAttemptRelay.
    // If an error does get here, the concrete implementation should be updated to
    // better handle is prior to being relayed. If a relayed transaction is frontrun
    // to cause this error, the item is still removed since we know it has already made it onchain.
    if (this.isImplementationError(err)) {
      this.logger.debug(`Onchain relay error for item: ${stringifiedItem}. The item will not be attempted again. Error message: ${(err as Error).message}`)
      return this.#db.removeItem(relayItem)
    }

    // If the error is an EVM error, the item will be attempted again. This is because
    // many of these errors are transient and can be resolved by attempting the transaction again.
    // The errors that are less likely to be resolved by attempting again should checked against
    // explicitly prior to sending the transaction.
    if (isEVMError(err)) {
      this.logger.debug(`EVM error for item: ${stringifiedItem}. The item will be attempted again. Error message: ${err.message}`)
      return this.#db.handleRelayError(relayItem)
    }

    // If the client does not know what the error is, it should not be attempted again since
    // it risks useless resource consumption from the poller. All errors should be deterministic
    // and handled before getting to this point. Alternatively, exponential backoff could be
    // used if unknown errors are more common than we would expect. This could occur in an
    // upgradable contract owned by a third party that is not under our control or a custom
    // signer with custom errors that are not known to us.
    this.logger.warn(`Unknown error for item: ${stringifiedItem}. The item will be not be attempted again. Error message: ${(err as Error).message}`)
    return this.#db.removeItem(relayItem)
  }
}

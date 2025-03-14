import { poll } from '#utils/poll.js'
import { Logger } from '#logger/index.js'
import { RelayerDB } from './RelayerDB.js'
import { isEVMError } from '#gasboost/index.js'
import { Config } from '#config/index.js'
import type { IRelayer } from './IRelayer.js'
import type { providers } from 'ethers'
import type { RelayTxContext } from './types.js'

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

export abstract class Relayer<RelayTxMethodName extends string, RelayItem> implements IRelayer {
  readonly #db: RelayerDB<RelayTxMethodName, RelayItem>
  // This poller is what relays transactions. The main resource consumed per poll is onchain calls,
  // which can be heavy if left unchecked. If this poller is too short, too many RPC calls
  // may be made for an unexpected transaction and cause exhaustion of resources. If the poller
  // is too long, users will have to wait longer for their transactions to be relayed. A thirty
  // second poller is a good balance between the two.
  readonly #pollIntervalMs: number = 30_000
  readonly #dryRun: boolean
  protected readonly logger: Logger

  abstract sendRelay(value: RelayItem, relayTxMethodName: RelayTxMethodName, relayChainId: string): Promise<providers.TransactionResponse>
  protected abstract formatRelayItem(relayTxMethodName: RelayTxMethodName, relayItem: any): RelayItem
  protected abstract shouldAttemptRelay(value: RelayItem, relayTxMethodName: RelayTxMethodName, relayChainId: string): Promise<boolean>
  protected abstract isImplementationError(err: unknown): boolean

  constructor (name: string) {
    this.#db = new RelayerDB(name)
    this.#dryRun = Config.GlobalConfig.options.dryRun
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
    for await (const [relayItem, relayTxContext] of this.#db.getRelayableItems()) {
      const { relayTxMethodName, relayChainId } = relayTxContext
      const canRelay = await this.shouldAttemptRelay(relayItem, relayTxMethodName, relayChainId)
      if (!canRelay) continue

      await this.#db.addRelayAttempt(relayItem)

      // Do not await this. We do not want to block the execution of
      // transactions. The relayItem will not continue to poll the
      // same relayItem until this method is resolved, so we don't
      // care if it is awaited.
      void this.#attemptRelay(relayItem, relayTxMethodName, relayChainId)
    }
  }

  /**
   * Relay
   */


  // The relayItem can be any format, since the sender does not care about the relay format type.
  // The relayer validates that there is sufficient data to process the relay.
  async relay (relayTxMethodName: RelayTxMethodName, relayItem: any, relayChainId: string): Promise<void> {
    this.logger.info(`Adding item to relay: ${JSON.stringify(relayItem)}`)
    const formattedRelayItem: RelayItem = this.formatRelayItem(relayTxMethodName, relayItem)
    const relayTxContext: RelayTxContext<RelayTxMethodName> = {
        relayChainId,
        relayTxMethodName
    }
    await this.#db.addItem(formattedRelayItem, relayTxContext)
  }

  /**
   * Internal
   */

  async #attemptRelay (relayItem: RelayItem, relayTxMethodName: RelayTxMethodName, relayChainId: string): Promise<void> {
    this.logger.info(`Relaying item: ${JSON.stringify(relayItem)}`)
    try {
      // TODO: Optimize: dryRun should be a feature of the provider, not the relayer.
      // Move it there when provider and signer modules are cleaned up.
      if (this.#dryRun) {
        this.logger.info(`Dry run enabled. Skipping relay for item: ${JSON.stringify(relayItem)}`)
        await this.#db.removeItem(relayItem)
        return
      }

      await this.sendRelay(relayItem, relayTxMethodName, relayChainId)
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

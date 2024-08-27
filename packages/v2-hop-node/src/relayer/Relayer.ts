import { poll } from '#utils/poll.js'
import { Logger } from '#logger/index.js'
import { TxRelayDB } from '#db/TxRelayDB.js'
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
  protected abstract shouldAttemptRelay(value: RelayItem): Promise<boolean>
  protected abstract sendRelay(value: RelayItem): Promise<providers.TransactionResponse>
  protected abstract handleOnchainRelayError(value: RelayItem, errMessage: string): void

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
      await this.#handleRelayError(relayItem, err.message)
    }
  }

  async #handleRelayError (relayItem: RelayItem, err: Error): Promise<void> {
    // TODO: Unknown
      // * Is failed err specific to contract or general rpc? Might be OOG.
    // TODO: Unhandled cases (all gasboost)
      // * bcr
        // * TODO
      // * gasBoost
        // * OOG
        // * Max rebroadcast
        // * Transaction replaced
        // * Transaction dropped
        // * Transaction hangs
        // * Reorg (though I think it might be handled by replace/drop/hang
        // * chain issues (look at historical experience)
        // * timeout
        // * RPC server error
    const cacheKey = this.getUniqueRelayId(relayItem)
    const errType = this.#getErrFromErr(err)

    // TODO: Handle contract

    // Tx errors
    if (errType === NonceTooLowError) {
      // This may occur if there are multiple servers running at once.
      // This item is removed from the cache so it can be reattempted.
      this.logger.debug(`Nonce already used for item: ${cacheKey}. The item will be attempted again.`)
      await this.#relayedTxCache.removeItem(cacheKey)
      return
    } else if (errType === EstimateGasError) {
      // TODO -- probably up a level
    } else if (errType === InsufficientFundsError) {
      this.logger.debug(`Insufficient funds to relay item: ${cacheKey}. Please add funds to the account.`)
      // TODO: Probably some higher order blocking since this will continue to fail
      // TODO: kick out of bcr
      return
    } else {
      // TODO
    }


      // TODO: V2: then update CCTP
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

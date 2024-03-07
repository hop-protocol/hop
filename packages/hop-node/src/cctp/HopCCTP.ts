import CCTP from './CCTP'
import Keyv from 'keyv'
import Poller from './Poller'
import { Event, providers, utils } from 'ethers'
import { Hop } from '@hop-protocol/sdk'

// To solve:
// * What happens on server restart
// * is there anything to do to run this on every chain?
// * handle in-flight messages
// * what if gasboost gets
// * should there be an instance per chain or one for all chains?
  // * one for all chains would allow onchain state lookup for message relay validation
  // * many for each chain would allow for chain specific config
// * should poller and cctp use default exports

interface HopCCTPImplementationEvent extends Event {
  message: string
}

interface MessageCache {
  depositTransactionHash: string
  relayTransactionHash: string
  message: string
}

export class HopCCTP extends CCTP {
  readonly #cache: Keyv
  readonly #sdk: Hop
  readonly #pollIntervalMs: number = 60_000

  readonly #provider: providers.JsonRpcProvider
  readonly #hopCctpImplementationAddress: string

  constructor (chainId: number) {
    super(chainId)

    this.#cache = new Keyv<MessageCache>()
    this.#sdk = new Hop({
      // TODO: How do we do this for all chains normally?
    })

    // TODO: How do we get providers?
    this.#provider = new providers.JsonRpcProvider('TODO')
    // TODO: Config for addr
    this.#hopCctpImplementationAddress = '0x'
  }

  // TODO: Does this need to be async to satisfy calling code?
  start (): void {
    Poller.poll(this.checkEvent, this.#pollIntervalMs)
    Poller.poll(this.checkAttestation, this.#pollIntervalMs)
    Poller.poll(this.checkRelay, this.#pollIntervalMs)
  }

  checkEvent = async (): Promise<void> => {
    const latestBlockNumberSynced: number = await this.#cache.get('latestBlockNumberSynced')
    const currentBlockNumber: number = await this.#provider.getBlockNumber()
    if (latestBlockNumberSynced === currentBlockNumber) {
      return
    } else if (latestBlockNumberSynced < currentBlockNumber) {
      throw new Error('latestBlockNumberSynced is greater than currentBlockNumber')
    }

    // TODO: Better poll handling on restart
    const events = await this.#sdk.getEvents(
      this.#hopCctpImplementationAddress,
      latestBlockNumberSynced,
      currentBlockNumber
    )

    for (const event of events) {
      await this.#handleEvent(event)
    }
  }

  checkAttestation = async (): Promise<void> => {
    for await (const [, value] of this.#cache.iterator()) {
      await this.#handleAttestation(value.depositTransactionHash, value.message)
    }
  }

  checkRelay = async (): Promise<void> => {
    for await (const [, value] of this.#cache.iterator()) {
      await this.#handleRelay(value.depositTransactionHash, value.message, value.relayTransactionHash)
    }
  }

  async #handleEvent (event: HopCCTPImplementationEvent): Promise<void> {
    const {
      transactionHash: depositTransactionHash,
      message
    } = event
    const cacheKey = this.#getCacheKey(depositTransactionHash, message)
    await this.#cache.set(cacheKey, {
      depositTransactionHash,
      message
    })
  }

  async #handleAttestation (depositTransactionHash: string, message: string): Promise<void> {
    // TODO: Handle err if implemented
    const attestation = await this.getAttestationForMessage(message)
    if (!attestation) {
      // TODO: Handle
      return
    }

    // TODO: How should I get the attestation
    const tx: providers.TransactionReceipt = this.#sdk.receiveMessage(message, attestation)
    const cacheKey = this.#getCacheKey(depositTransactionHash, message)
    await this.#cache.set(cacheKey, {
      relayTransactionHash: tx.transactionHash
    })
  }

  async #handleRelay(depositTransactionHash: string, message: string, relayTransactionHash: string): Promise<void> {
    const tx: providers.TransactionReceipt = await this.#provider.getTransactionReceipt(relayTransactionHash)

    if (!tx) {
      // TODO: Handle this
      // tx not found, could be a reorg
    }

    if (tx.status === 0) {
      // TODO: Handle this
      // TODO: Is status check all that is needed
      // TODO: If the tx failed, should we get rid of the relayTransactionHash from the cache so it tries again?
      return
    } else if (tx.status === 1) {
      const isRelayed = await this.isMessageRelayedInTx(message, tx)
      if (!isRelayed) {
        // TODO: Throw? Or reset the relayTransactionHash?
      }
    } else {
      throw new Error('Invalid tx status')
    }

    const cacheKey = this.#getCacheKey(depositTransactionHash, message)
    await this.#cache.delete(cacheKey)
  }


  #getCacheKey (depositTransactionHash: string, message: string): string {
    // Use both since a message can change without the tx hash changing
    return utils.keccak256(depositTransactionHash + message)
  }
}

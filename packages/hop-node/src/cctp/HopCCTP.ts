import CCTP from './CCTP.js'
import chainIdToSlug from 'src/utils/chainIdToSlug'
import wallets from 'src/wallets/index.js'
import { Event, providers, utils } from 'ethers'
import { EventEmitter } from 'node:events'
import { Hop } from '@hop-protocol/sdk'

// To solve:
// * add decorator for log
// * should poller and cctp use default exports
//
// * convert to persistent storage
// * What happens on server restart


interface HopCCTPImplementationEvent extends Event {

enum HopCCTPEventType {
  Deposit = 'deposit',
  Attestation = 'attestation',
  Relay = 'relay'
}

// TODO: Get from SDK
interface HopCCTPImplDepositEvent extends Event {
  message: string
}

// TODO: Get from SDK
interface HopCCTPImplRelayEvent extends Event {
  message: string
}

interface Message {
  message: string
  depositTransactionHash: string
  relayTransactionHash: string | null
}

type Cache<T> = Map<string, T>

class HopCCTPPoller {
  readonly #pollIntervalMs: number = 60_000

  constructor (
    private readonly sdk: Hop,
    private readonly cache: Cache<Message>,
    private readonly eventEmitter: EventEmitter
  ) {}

  start (): void {
    setInterval(this.checkDepositEvent, this.#pollIntervalMs)
    setInterval(this.checkAttestation, this.#pollIntervalMs)
    setInterval(this.checkRelayEvent, this.#pollIntervalMs)
  }

  checkDepositEvent = async (): Promise<void> => {
    // TODO: start/end
    const start = 0
    const end = 1
    const depositEvents: HopCCTPImplDepositEvent[] = await this.#sdk.getEvents.Deposit(start, end)
    for (const depositEvent of depositEvents) {
      this.eventEmitter.emit(HopCCTPEventType.Deposit, depositEvent)
    }
  }

  checkAttestation = async (): Promise<void> => {
    this.cache.forEach(async (value: Message) => {
      this.eventEmitter.emit(HopCCTPEventType.Attestation, value)
    })
  }

  checkRelayEvent = async (): Promise<void> => {
    // TODO: start/end
    const start = 0
    const end = 1
    const relayEvents: HopCCTPImplRelayEvent[] = await this.sdk.getEvents.Relay(start, end)
    for (const relayEvent of relayEvents) {
      this.eventEmitter.emit(HopCCTPEventType.Relay, relayEvent)
    }
  }
}

class HopCCTPHandler extends CCTP {
  constructor (
    private readonly sdk: Hop,
    private readonly cache: Cache<Message>,
    private readonly eventEmitter: EventEmitter,
    network: string
  ) {
    super(network)
  }

  start (): void {
    this.eventEmitter.on(HopCCTPEventType.Deposit, this.#handleDepositEvent)
    this.eventEmitter.on(HopCCTPEventType.Attestation, this.#handleAttestation)
    this.eventEmitter.on(HopCCTPEventType.Relay, this.#handleRelayEvent)
  }

  #handleDepositEvent = async (event: HopCCTPImplDepositEvent): Promise<void> => {
    const { transactionHash, message } = event
    const cacheKey = this.#getCacheKey(message)

    // Polling may see the same event multiple times
    if (this.cache.has(cacheKey)) {
      return
    }

    this.cache.set(cacheKey, {
      message,
      depositTransactionHash: transactionHash,
      relayTransactionHash: null
    })
  }

  #handleAttestation = async (message: string): Promise<void> => {
    const cacheKey = this.#getCacheKey(message)
    const existingCache = this.cache.get(cacheKey)
    if (!existingCache) {
      return
    }

    // Retry if a transaction has been dropped from the mempool or reorged out before
    // the attestation event was seen
    if (existingCache.relayTransactionHash !== null) {
      // TODO: timestamp or check mempool status?
    }

    const attestation = await this.getAttestationForMessage(message)
    if (!attestation) {
      return
    }

    const tx: providers.TransactionResponse = this.sdk.receiveMessage(message, attestation)
    const cacheValue = Object.assign({ relayTransactionHash: tx.hash }, existingCache)
    this.cache.set(cacheKey, cacheValue)
  }

  #handleRelayEvent = async (event: HopCCTPImplRelayEvent): Promise<void> => {
    const { message } = event
    const cacheKey = this.#getCacheKey(message)
    const existingCache = this.cache.get(cacheKey)
    if (!existingCache) {
      return
    }

    if (existingCache.relayTransactionHash === null) {
      throw new Error('Relay event without relay transaction hash')
    }

    this.cache.delete(cacheKey)
  }

  #getCacheKey (message: string): string {
    return utils.keccak256(message)
  }
}

export class HopCCTPImpl {
  constructor (network: string, chainId: number, cache: Cache<Message>) {
    const eventEmitter = new EventEmitter()
    const wallet = wallets.get(chainIdToSlug(chainId))
    const sdk = new Hop({
      network: network,
      signer: wallet
    })

    // Start handlers first to guarantee that the poller does not
    // see any events prior to the handler starting up
    const handler = new HopCCTPHandler( sdk, cache, eventEmitter, network)
    handler.start()

    const poller = new HopCCTPPoller(sdk, cache, eventEmitter)
    poller.start()
  }
}

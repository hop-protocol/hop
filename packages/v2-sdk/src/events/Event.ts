import { EventContext, EthersEventWithDecodedTypes, EthersEventWithDecodedTypesAndContext, EthersEventWithDecodedTypesAndBaseContext, BaseEventContext } from './types.js'
import { promiseQueue } from '@hop-protocol/sdk'
import { providers, BigNumberish, Event as EthersEvent, utils, EventFilter } from 'ethers'

export class Event<T> {
  provider: providers.Provider
  chainId: BigNumberish
  batchBlocks: number
  address: string
  eventName: string
  abi: any
  factory: any

  constructor(
    provider?: providers.Provider,
    chainId?: BigNumberish,
    batchBlocks?: number,
    address?: string
  ) {
    this.provider = provider ?? this.provider
    this.chainId = chainId ?? this.chainId
    this.batchBlocks = batchBlocks || 1_000_000
    this.address = address ?? this.address
  }

  getContract(): Contract {
    return this.factory.connect(this.address, this.provider)
  }

  getEventNameFromTopic(topic0: string): string | null {
    const iface = new utils.Interface(this.abi)
    const eventFragment = Object.values(iface.events).find(eventFragment => iface.getEventTopic(eventFragment) === topic0)
    return eventFragment ? eventFragment.name : null
  }

  parseEthersEventLog(ethersEvent: EthersEvent): any {
    const iface = new utils.Interface(this.abi)
    return iface.parseLog(ethersEvent)
  }

  getFilter(): EventFilter {
    const contract = this.getContract()
    if (!contract.filters[this.eventName]) {
      throw new Error(`Event ${this.eventName} not found in contract filters`)
    }
    return contract.filters[this.eventName]()
  }

  getTopic0(): string {
    const iface = new utils.Interface(this.abi)
    return iface.getEventTopic(this.eventName)
  }

  async populateEvents(inputEvents: EthersEvent[], fetchTxData: boolean = false): Promise<EthersEventWithDecodedTypesAndContext<T>[]> {
    const events = inputEvents.map(event => this.addTypedEvent(event))
    const promiseFns = events.map(event => () => this.addContextToEvent(event, fetchTxData))

    const populatedEvents: EthersEventWithDecodedTypesAndContext<T>[] = []

    await promiseQueue(promiseFns, async (fn: () => Promise<EthersEventWithDecodedTypesAndContext<T>>) => {
      const result = await fn()
      populatedEvents.push(result)
    }, { concurrency: 20 })

    return populatedEvents
  }

  addTypedEvent(ethersEvent: EthersEvent): EthersEventWithDecodedTypesAndBaseContext<T> {
  addTypedEvent(ethersEvent: EthersEvent, chainId?: string): EthersEventWithDecodedTypesAndBaseContext<T> {
    const decoded = this.toTypedEvent(ethersEvent)
    const eventWithDecoded = {
      ...ethersEvent,
      decoded
    } as EthersEventWithDecodedTypes<T>

    return {
      ...ethersEvent,
      decoded,
      context: this.getBaseEventContext(eventWithDecoded)
      context: this.getBaseEventContext(eventWithDecoded, chainId)
    }
  }

  toTypedEvent(ethersEvent: EthersEvent): T {
    throw new Error('Not implemented')
  }

  async addContextToEvent(event: EthersEventWithDecodedTypesAndBaseContext<T>, fetchTxData = false): Promise<EthersEventWithDecodedTypesAndContext<T>> {
    const context = await (fetchTxData ? this.getReceiptEventContext(event) : this.getBaseEventContext(event))
    return {
      ...event,
      context
    } as EthersEventWithDecodedTypesAndContext<T>
  }

  getBaseEventContext(event: EthersEventWithDecodedTypes<T>): BaseEventContext {
  getBaseEventContext(event: EthersEventWithDecodedTypes<T>, chainId?: string): BaseEventContext {
    try {
      const chainSlug = this.getChainSlug(this.chainId ?? 0)
      const chainSlug = this.getChainSlug(chainId ?? this.chainId ?? 0)
      const { transactionHash, transactionIndex, logIndex, blockNumber } = event

      return {
        eventName: this.eventName,
        chainSlug,
        chainId: this.chainId.toString(),
        chainId: chainId ?? this.chainId.toString(),
        transactionHash,
        transactionIndex,
        logIndex,
        blockNumber
      }
    } catch (err: unknown) {
      console.error('hopV2Sdk: getEventContext error:', err, this.chainId, event)
      throw err
    }
  }

  async getReceiptEventContext(event: EthersEventWithDecodedTypes<T>): Promise<EventContext> {
    try {
      const { transactionHash, blockNumber } = event

      let fetchedTxData = {}
      const [block, transaction, receipt] = await Promise.all([
        this.provider.getBlock(blockNumber),
        this.provider.getTransaction(transactionHash),
        this.provider.getTransactionReceipt(transactionHash)
      ])

      const { timestamp: blockTimestamp } = block
      const { value, nonce, gasLimit, gasPrice, data } = transaction
      const { from, to, gasUsed, status } = receipt

      fetchedTxData = {
        blockTimestamp,
        from,
        to,
        value: value.toString(),
        nonce: Number(nonce.toString()),
        gasLimit: Number(gasLimit.toString()),
        gasUsed: Number(gasUsed.toString()),
        gasPrice: gasPrice?.toString(),
        data,
        status
      }

      const baseEventContext = this.getBaseEventContext(event)

      return {
        ...baseEventContext,
        ...fetchedTxData
      }
    } catch (err: unknown) {
      console.error('hopV2Sdk: getEventContext error:', err, this.chainId, event)
      throw err
    }
  }

  getChainSlug(chainId: BigNumberish): string {
    return getChainSlug(chainId)
  }

  decodeEventsFromTransactionReceipt(receipt: providers.TransactionReceipt): EthersEventWithDecodedTypes<T>[] {
    const iface = new utils.Interface(this.abi)
    const decodedEvents: EthersEventWithDecodedTypes<T>[] = []

    for (const log of receipt.logs) {
      try {
        // Check if this log is for our event by matching the event signature
        const eventName = this.getEventNameFromTopic(log.topics[0])
        if (!eventName) {
          continue
        }

        // Parse and decode the event
        const ethersEvent: EthersEvent = {
          ...log,
          event: eventName,
          eventSignature: iface.getEvent(eventName).format(),
          args: iface.parseLog(log).args,
          decode: (data: string) => iface.parseLog(log),
          removeListener: () => {},
          getBlock: () => this.provider.getBlock(log.blockHash),
          getTransaction: () => this.provider.getTransaction(log.transactionHash),
          getTransactionReceipt: () => this.provider.getTransactionReceipt(log.transactionHash)
        }

        const decodedEvent = this.addTypedEvent(ethersEvent)
        decodedEvents.push(decodedEvent)
      } catch (err) {
        // Skip logs that don't match our event interface
        continue
      }
    }

    return decodedEvents
  }
}

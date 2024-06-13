import { EventContext, EventBase, Filter, EthersEventWithDecodedTypes } from './types.js'
import { EventFetcher, InputFilter } from './eventFetcher/index.js'
import { chainSlugMap } from '#utils/chainSlugMap.js'
import { promiseQueue } from '@hop-protocol/sdk'
import { providers, BigNumberish, Event as EthersEvent, utils, Contract, EventFilter } from 'ethers'

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

  parseEthersEventLog (ethersEvent: EthersEvent): any {
    const iface = new utils.Interface(this.abi)
    return iface.parseLog(ethersEvent)
  }

  getFilter (): EventFilter {
    const contract = this.getContract()
    return contract.filters[this.eventName]()
  }

  getTopic0 (): string | null {
    const iface = new utils.Interface(this.abi)
    return iface.getEventTopic(this.eventName)
  }

  async getEventsWithFilter(filter: Filter, fromBlock: number, toBlock?: number): Promise<T[]> {
    const eventFetcher = new EventFetcher({
      provider: this.provider,
      batchBlocks: this.batchBlocks
    })

    const endBlock = toBlock ?? await this.provider.getBlockNumber()
    const events = await eventFetcher.fetchEvents([filter as InputFilter], { fromBlock, toBlock: endBlock })

    console.log(`populating events. count: ${events.length}`)
    return this.populateEvents(events)
  }

  async *getEventsWithFilterAsGenerator(filter: Filter, fromBlock: number, toBlock?: number): AsyncGenerator<T[]> {
    const eventFetcher = new EventFetcher({
      provider: this.provider,
      batchBlocks: this.batchBlocks
    })

    const endBlock = toBlock ?? await this.provider.getBlockNumber()
    const eventGenerator = eventFetcher.fetchEventsAsGenerator([filter as InputFilter], { fromBlock, toBlock: endBlock })

    for await (const events of eventGenerator) {
      console.log(`populating events. count: ${events.length}`)
      yield await this.populateEvents(events)
    }
  }

  async getEvents (fromBlock: number, toBlock?: number): Promise<T[]> {
    const filter = this.getFilter()
    return this.getEventsWithFilter(filter, fromBlock, toBlock)
  }

  async *getEventsAsGenerator(fromBlock: number, toBlock?: number): AsyncGenerator<T[]> {
    const eventsGenerator = this.getEventsWithFilterAsGenerator(this.getFilter(), fromBlock, toBlock)

    for await (const events of eventsGenerator) {
      yield events
    }
  }

  async populateEvents<T>(inputEvents: EthersEvent[]): Promise<T[]> {
    const events = inputEvents.map(this.addTypedEvent.bind(this))
    const promiseFns = events.map(event => () => this.addContextToEvent(event, this.chainId))

    const populatedEvents: Event<T>[] = []

    await promiseQueue(promiseFns, async (fn: () => Promise<Event<T>>) => {
      const result = await fn()
      populatedEvents.push(result)
    }, { concurrency: 20 })

    return populatedEvents as T[]
  }

  addTypedEvent(ethersEvent: EthersEvent): EthersEventWithDecodedTypes<T> {
    return {
      ...ethersEvent,
      decoded: this.toTypedEvent(ethersEvent)
    }
  }

  toTypedEvent (ethersEvent: EthersEvent): T {
    throw new Error('Not implemented')
  }

  async addContextToEvent(event: EthersEventWithDecodedTypes<T>, chainId: BigNumberish, fetchTxData = false): Promise<T> {
    event.context = await this.getEventContext(event, chainId, fetchTxData)
    return event as T
  }

  async getEventContext(event: EthersEventWithDecodedTypes<T>, chainId: BigNumberish, fetchTxData = false): Promise<EventContext> {
    try {
      const chainSlug = this.getChainSlug(chainId)
      const { transactionHash, transactionIndex, logIndex, blockNumber } = event

      let fetchedTxData = {}
      if (fetchTxData) {
        const [block, transaction, receipt] = await Promise.all([
          this.provider.getBlock(blockNumber),
          this.provider.getTransaction(transactionHash),
          this.provider.getTransactionReceipt(transactionHash)
        ])

        const { timestamp: blockTimestamp } = block
        const { value, nonce, gasLimit, gasPrice, data } = transaction
        const { from, to, gasUsed } = receipt

        fetchedTxData = {
          blockTimestamp,
          from,
          to,
          value: value.toString(),
          nonce: Number(nonce.toString()),
          gasLimit: Number(gasLimit.toString()),
          gasUsed: Number(gasUsed.toString()),
          gasPrice: gasPrice?.toString(),
          data
        }
      }

      return {
        eventName: this.eventName,
        chainSlug,
        chainId: chainId.toString(),
        transactionHash,
        transactionIndex,
        logIndex,
        blockNumber,
        ...fetchedTxData
      }
    } catch (err) {
      console.error('getEventContext error:', err, chainId, event)
      throw err
    }
  }

  getChainSlug(chainId: BigNumberish): string {
    const chainSlug = chainSlugMap[chainId.toString()];
    if (!chainSlug) {
      throw new Error(`Invalid chain "${chainId}", slug not found`)
    }
    return chainSlug
  }

  decodeEventsFromTransactionReceipt(receipt: providers.TransactionReceipt): T[] {
    const topic = this.getTopic0()
    return receipt.logs
      .filter(log => log.topics[0] === topic)
      .map(log => this.toTypedEvent(log as EthersEvent))
  }
}

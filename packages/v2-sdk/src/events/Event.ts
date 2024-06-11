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
  static eventName: string
  static abi: any
  static factory: any

  constructor (provider?: providers.Provider, chainId?: BigNumberish, batchBlocks?: number, address?: string) {
    if (provider) {
      this.provider = provider
    }
    if (chainId) {
      this.chainId = chainId
    }
    if (batchBlocks) {
      this.batchBlocks = batchBlocks
    }
    if (this.batchBlocks === 0) {
      this.batchBlocks = 1_000_000
    }
    if (address) {
      this.address = address
    }
  }

  get eventName() {
    return Event.eventName
  }

  get abi () {
    return Event.abi
  }

  get factory () {
    return Event.factory
  }

  getContract(): Contract {
    const contract = this.factory.connect(this.address, this.provider)
    return contract
  }

  static get topic0(): string {
    const iface = new utils.Interface(this.abi)
    const topic0 = iface.getEventTopic(this.eventName)
    return topic0
  }

  static getEventNameFromTopic (topic0: string): string | null {
    const iface = new utils.Interface(Event.abi)
    for (let eventFragment of Object.values(iface.events)) {
      if (iface.getEventTopic(eventFragment) === topic0) {
        return eventFragment.name
      }
    }
    return null
  }

  parseEthersEventLog (ethersEvent: EthersEvent): any {
    const iface = new utils.Interface(this.abi)
    const decoded = iface.parseLog(ethersEvent)
    return decoded
  }

  getFilter (): EventFilter {
    const contract = this.getContract()
    const filter = contract.filters[this.eventName]()
    return filter
  }

  getTopic0 (): string | string[] | null {
    const filter = this.getFilter()
    return filter.topics?.[0] ?? null
  }

  async getEventsWithFilter(filter: Filter, fromBlock: number, toBlock?: number): Promise<T[]> {
    const eventFetcher = new EventFetcher({
      provider: this.provider,
      batchBlocks: this.batchBlocks
    })
    if (!toBlock) {
      toBlock = await this.provider.getBlockNumber()
    }
    const events = await eventFetcher.fetchEvents([filter as InputFilter], { fromBlock, toBlock })
    console.log(`populating events. count: ${events.length}`)
    return this.populateEvents(events)
  }

  async *getEventsWithFilterAsGenerator(filter: Filter, fromBlock: number, toBlock?: number): AsyncGenerator<T[]> {
    const eventFetcher = new EventFetcher({
      provider: this.provider,
      batchBlocks: this.batchBlocks
    });

    if (!toBlock) {
      toBlock = await this.provider.getBlockNumber();
    }

    const eventGenerator = eventFetcher.fetchEventsAsGenerator([filter as InputFilter], { fromBlock, toBlock });

    for await (const events of eventGenerator) {
      console.log(`populating events. count: ${events.length}`);
      const populatedEvents = await this.populateEvents<T>(events);
      yield populatedEvents
    }
  }

  async getEvents (fromBlock: number, toBlock?: number): Promise<T[]> {
    const filter = this.getFilter()
    const events = await this.getEventsWithFilter(filter, fromBlock, toBlock)
    return events
  }

  async *getEventsAsGenerator(fromBlock: number, toBlock?: number): AsyncGenerator<T[]> {
    const filter = this.getFilter();
    const eventsGenerator = this.getEventsWithFilterAsGenerator(filter, fromBlock, toBlock);

    for await (const events of eventsGenerator) {
      yield events;
    }
  }

  async populateEvents<T>(inputEvents: EthersEvent[]): Promise<T[]> {
    const events = inputEvents.map(x => this.addTypedEvent(x))
    const promiseFns = events.map(event => () => this.addContextToEvent(event, this.chainId))

    const populatedEvents : Event<T>[] = []
    await promiseQueue(promiseFns, async (fn: () => any) => { // TODO: type
      populatedEvents.push(await fn())
    }, { concurrency: 20 })

    return populatedEvents.map((event) => event as T)
  }

  addTypedEvent (ethersEvent: EthersEvent): EthersEventWithDecodedTypes<T> {
    const decoded = this.toTypedEvent(ethersEvent)
    return {
      ...ethersEvent,
      decoded
    }
  }

  toTypedEvent (ethersEvent: EthersEvent): T {
    throw new Error('Not implemented')
  }

  async addContextToEvent (event: EthersEventWithDecodedTypes<T>, chainId: BigNumberish, fetchTxData: boolean = false): Promise<T> {
    const context = await this.getEventContext(event, chainId, fetchTxData)
    event.context = context
    return event as T
  }

  async getEventContext (event: EthersEventWithDecodedTypes<T>, chainId: BigNumberish, fetchTxData: boolean = false): Promise<EventContext> {
    try {
      const chainSlug = this.getChainSlug(chainId)
      const transactionHash = event.transactionHash
      const transactionIndex = event.transactionIndex
      const logIndex = event.logIndex
      const blockNumber = event.blockNumber

      let fetchedTxData = {}
      if (fetchTxData) {
        const [
          { timestamp: blockTimestamp },
          { value, nonce, gasLimit, gasPrice, data },
          { from, to, gasUsed }
        ] = await Promise.all([
          this.provider.getBlock(blockNumber),
          this.provider.getTransaction(transactionHash),
          this.provider.getTransactionReceipt(transactionHash)
        ])

        fetchedTxData = {
          blockTimestamp,
          from,
          to,
          value: value.toString(),
          nonce: Number(nonce.toString()),
          gasLimit: Number(gasLimit?.toString()),
          gasUsed: Number(gasUsed?.toString()),
          gasPrice: gasPrice?.toString() as string,
          data
        }
      }

      return {
        eventName: this.eventName,
        chainSlug,
        chainId: chainId?.toString(),
        transactionHash,
        transactionIndex,
        logIndex,
        blockNumber,
        ...fetchedTxData
      }
    } catch (err) {
      console.log('getEventContext error:', err, chainId, event)
      throw err
    }
  }

  getChainSlug (chainId: BigNumberish): string {
    const chainSlug = chainSlugMap[chainId?.toString()]
    if (!chainSlug) {
      throw new Error(`Invalid chain "${chainId?.toString()}", slug not found`)
    }
    return chainSlug
  }

  decodeEventsFromTransactionReceipt (receipt: providers.TransactionReceipt): T[] {
    const decodedEvents: T[] = []
    const topic = this.getTopic0()
    for (const log of receipt.logs) {
      if (log.topics[0] === topic) {
        const decoded = this.toTypedEvent(log as EthersEvent)
        decodedEvents.push(decoded)
      }
    }
    return decodedEvents
  }
}

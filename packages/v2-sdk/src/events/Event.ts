import { EventContext, EventBase, Filter } from './types.js'
import { EventFetcher, InputFilter } from './eventFetcher/index.js'
import { chainSlugMap } from '#utils/chainSlugMap.js'
import { promiseQueue } from '@hop-protocol/sdk-core'
import { providers, BigNumberish, Event as EthersEvent } from 'ethers'

export class Event<T> {
  provider: providers.Provider
  chainId: BigNumberish
  batchBlocks: number
  address: string
  eventName: string

  constructor (provider: providers.Provider, chainId: BigNumberish, batchBlocks: number, address: string) {
    if (!provider) {
      throw new Error('expected provider')
    }
    this.provider = provider
    this.chainId = chainId
    this.batchBlocks = batchBlocks
    if (this.batchBlocks === 0) {
      this.batchBlocks = 1_000_000
    }
    this.address = address
  }

  getFilter (): Filter {
    throw new Error('Not implemented. This should be implemented by child class.')
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

  async getEvents (fromBlock: number, toBlock?: number): Promise<T[]> {
    const filter = this.getFilter()
    const events = await this.getEventsWithFilter(filter, fromBlock, toBlock)
    return events
  }

  async populateEvents<T>(inputEvents: EthersEvent[]): Promise<T[]> {
    const events = inputEvents.map(x => this.toTypedEvent(x)) as EventBase[]
    const promiseFns = events.map(event => () => this.addContextToEvent(event, this.chainId))

    const populatedEvents : Event<T>[] = []
    await promiseQueue(promiseFns, async (fn: () => any) => { // TODO: type
      populatedEvents.push(await fn())
    }, { concurrency: 20 })

    return populatedEvents.map((event) => event as T)
  }

  toTypedEvent (ethersEvent: EthersEvent): T {
    throw new Error('Not implemented')
  }

  async addContextToEvent (event: EventBase, chainId: BigNumberish): Promise<T> {
    const context = await this.getEventContext(event.eventLog!, chainId)
    event.context = context
    return event as T
  }

  async getEventContext (event: EthersEvent, chainId: BigNumberish): Promise<EventContext> {
    try {
      const chainSlug = this.getChainSlug(chainId)
      const transactionHash = event.transactionHash
      const transactionIndex = event.transactionIndex
      const logIndex = event.logIndex
      const blockNumber = event.blockNumber
      const [
        { timestamp: blockTimestamp },
        { value, nonce, gasLimit, gasPrice, data },
        { from, to, gasUsed }
      ] = await Promise.all([
        this.provider.getBlock(blockNumber),
        this.provider.getTransaction(transactionHash),
        this.provider.getTransactionReceipt(transactionHash)
      ])

      return {
        chainSlug,
        chainId: chainId?.toString(),
        transactionHash,
        transactionIndex,
        logIndex,
        blockNumber,
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

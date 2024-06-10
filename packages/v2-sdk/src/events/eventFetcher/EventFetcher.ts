import { Filter } from '@ethersproject/abstract-provider'
import { promiseQueue } from '@hop-protocol/sdk'
import { providers, utils, Event as EthersEvent } from 'ethers'

const { getAddress: checksumAddress } = utils

const DefaultBatchBlocks = 2000

export type Options = {
  provider: providers.Provider
  batchBlocks?: number
}

export type FetchOptions = {
  fromBlock: number
  toBlock: number
}

export type InputFilter = {
  address: string
  topics: (string | string[])[]
}

export class EventFetcher {
  provider: providers.Provider
  batchBlocks: number = DefaultBatchBlocks

  constructor (options: Options) {
    if (!options.provider) {
      throw new Error('provider is required')
    }
    this.provider = options.provider

    if (options.batchBlocks) {
      this.batchBlocks = options.batchBlocks
    }
  }

  async fetchEvents (filters: InputFilter[], options: FetchOptions) {
    const blockRanges = this.getChunkedBlockRanges(options.fromBlock, options.toBlock)

    const promiseFns : any[] = [] // TODO: type
    for (const [batchStart, batchEnd] of blockRanges) {
      const batchOptions = {
        fromBlock: batchStart,
        toBlock: batchEnd
      }

      const aggregatedFilters = this.aggregateFilters(filters, batchOptions)
      const batchedEventsFn = () => this.fetchEventsWithAggregatedFilters(aggregatedFilters)
      promiseFns.push(batchedEventsFn)
    }

    const events = await this.parallelFetch(promiseFns)
    return this.normalizeEvents(events)
  }

async *fetchEventsAsGenerator (filters: InputFilter[], options: FetchOptions) {
  const blockRanges = this.getChunkedBlockRanges(options.fromBlock, options.toBlock);

  for (const [batchStart, batchEnd] of blockRanges) {
    const batchOptions = {
      fromBlock: batchStart,
      toBlock: batchEnd
    };

    const aggregatedFilters = this.aggregateFilters(filters, batchOptions);
    const batchedEvents = await this.fetchEventsWithAggregatedFilters(aggregatedFilters);

    // Normalize the events if needed
    const normalizedEvents = this.normalizeEvents(batchedEvents);

    // Yield the normalized events
    yield normalizedEvents;
  }
}

  getChunkedBlockRanges (fromBlock: number, toBlock: number) {
    fromBlock = Math.min(fromBlock, toBlock)
    let batchStart = fromBlock
    let batchEnd = Math.min(batchStart + this.batchBlocks, toBlock)

    const blockRanges: number[][] = []
    while (batchEnd <= toBlock) {
      blockRanges.push([batchStart, batchEnd])

      if (batchEnd === toBlock) {
        break
      }

      batchStart = batchEnd
      batchEnd = Math.min(batchStart + this.batchBlocks, toBlock)
    }

    return blockRanges
  }

  aggregateFilters (filters: InputFilter[], options: FetchOptions): Filter[] {
    const fromBlock = options.fromBlock
    const toBlock = options.toBlock
    const filtersByAddress :Record<string, Partial<Filter>> = {}

    if (filters.length === 1) {
      const filter = filters[0]
      const address = checksumAddress(filter.address)
      filter.address = address
      filtersByAddress[address] = filter
    } else if (filters.length > 1) {
      for (const filter of filters) {
        if (filter.address) {
          const address = checksumAddress(filter.address)
          if (!filtersByAddress[address]) {
            filtersByAddress[address] = {}
          }
          const obj = filtersByAddress[address]
          if (!obj.address) {
            obj.address = address
          }
          const topics: (string | string[])[] = (obj.topics ?? []) as string[]
          if (filter.topics) {
            for (let i = 0; i < filter.topics.length; i++) {
              const topic : string[] | string = filter.topics[i]
              if (!topics[i]) {
                topics[i] = []
              }
              if (!topics[i].includes(topic as string)) {
                (topics[i] as string[]).push(topic as string)
              }
            }
          }
          obj.topics = topics
          filtersByAddress[address] = obj
        }
      }
    }

    const aggregatedFilters: Filter[] = []
    for (const address in filtersByAddress) {
      const filter = filtersByAddress[address]
      aggregatedFilters.push({ ...filter, fromBlock, toBlock })
    }

    return aggregatedFilters
  }

  private async fetchEventsWithAggregatedFilters (aggregatedFilters: Filter[]) {
    const promises = []
    for (const filter of aggregatedFilters) {
      promises.push(this.provider.getLogs({ ...filter }))
    }

    const promiseResults = await Promise.all(promises)
    const result : EthersEvent[] = []
    for (const events of promiseResults) {
      result.push(...events as EthersEvent[])
    }
    return result
  }

  private normalizeEvents (events: EthersEvent[]) {
    const filteredEvents : EthersEvent[] = []
    const seen :Record<string, boolean> = {}
    for (const event of events) {
      const key = `${event.transactionHash}-${event.logIndex}`
      if (!seen[key]) {
        seen[key] = true
        filteredEvents.push(event)
      }
    }
    return filteredEvents.sort((a, b) => this.sortByBlockNumber(a, b))
  }

  private async parallelFetch (promiseFns: any[]) { // TODO: type
    const events: EthersEvent[] = []
    let i = 1
    await promiseQueue(promiseFns, async (fn: any) => { // TODO: type
      const batchedEvents = await fn()
      console.log(`got batch ${i++}/${promiseFns.length}`)
      events.push(...batchedEvents)
    }, { concurrency: 20 })
    return events
  }

  private sortByBlockNumber (a: EthersEvent, b: EthersEvent): number {
    if (a.blockNumber > b.blockNumber) return 1
    if (a.blockNumber < b.blockNumber) return -1

    if (a.logIndex > b.logIndex) return 1
    if (a.logIndex < b.logIndex) return -1

    return 0
  }
}

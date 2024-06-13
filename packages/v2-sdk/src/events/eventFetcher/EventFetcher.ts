import { Filter } from '@ethersproject/abstract-provider'
import { promiseQueue } from '@hop-protocol/sdk'
import { providers, utils, Event as EthersEvent } from 'ethers'

const { getAddress: checksumAddress } = utils

const DefaultBatchBlocks = 2000

export type Options = {
  provider?: providers.Provider
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
    this.provider = options?.provider ?? this.provider
    this.batchBlocks = options?.batchBlocks ?? this.batchBlocks
  }

  async fetchEvents(filters: InputFilter[], options: FetchOptions) {
    const blockRanges = this.getChunkedBlockRanges(options.fromBlock, options.toBlock)

    const promiseFns = blockRanges.map(([batchStart, batchEnd]) => {
      const batchOptions = { fromBlock: batchStart, toBlock: batchEnd }
      const aggregatedFilters = this.aggregateFilters(filters, batchOptions)
      return () => this.fetchEventsWithAggregatedFilters(aggregatedFilters)
    })

    const events = await this.parallelFetch(promiseFns)
    return this.normalizeEvents(events)
  }

  async *fetchEventsAsGenerator(filters: InputFilter[], options: FetchOptions) {
    const blockRanges = this.getChunkedBlockRanges(options.fromBlock, options.toBlock)

    for (const [fromBlock, toBlock] of blockRanges) {
      const aggregatedFilters = this.aggregateFilters(filters, { fromBlock, toBlock })
      const batchedEvents = await this.fetchEventsWithAggregatedFilters(aggregatedFilters)
      yield this.normalizeEvents(batchedEvents)
    }
  }

  getChunkedBlockRanges(fromBlock: number, toBlock: number): number[][] {
    const blockRanges: number[][] = []

    if (fromBlock > toBlock) {
      blockRanges.push([toBlock, toBlock])
      return blockRanges
    }

    while (fromBlock < toBlock) {
      const batchEnd = Math.min(fromBlock + this.batchBlocks, toBlock)
      blockRanges.push([fromBlock, batchEnd])
      fromBlock = batchEnd
    }

    // Ensure at least one range is returned if fromBlock equals toBlock
    if (blockRanges.length === 0) {
      blockRanges.push([fromBlock, toBlock])
    }

    return blockRanges
  }

  aggregateFilters(filters: InputFilter[], options: FetchOptions): Filter[] {
    const { fromBlock, toBlock } = options
    const filtersByAddress: Record<string, Partial<Filter>> = {}

    filters.forEach(filter => {
      if (filter.address) {
        const address = checksumAddress(filter.address)
        const existingFilter = filtersByAddress[address] || { address, topics: [] }

        if (filter.topics) {
          filter.topics.forEach((topic, i) => {
            if (!existingFilter.topics![i]) {
              existingFilter.topics![i] = []
            }
            if (!existingFilter.topics![i]!.includes(topic as string)) {
              (existingFilter.topics![i] as string[]).push(topic as string)
            }
          })
        }

        filtersByAddress[address] = existingFilter
      }
    })

    return Object.values(filtersByAddress).map(filter => ({
      ...filter,
      fromBlock,
      toBlock
    }))
  }


  private async fetchEventsWithAggregatedFilters(aggregatedFilters: Filter[]): Promise<EthersEvent[]> {
    const promises = aggregatedFilters.map(filter => this.provider.getLogs({ ...filter }))
    const promiseResults = await Promise.all(promises)
    return promiseResults.flat() as EthersEvent[]
  }

  private normalizeEvents(events: EthersEvent[]): EthersEvent[] {
    const seen = new Set<string>()
    const filteredEvents = events.filter(event => {
      const key = `${event.transactionHash}-${event.logIndex}`
      if (!seen.has(key)) {
        seen.add(key)
        return true
      }
      return false
    })

    return filteredEvents.sort(this.sortByBlockNumber)
  }

  private async parallelFetch(promiseFns: (() => Promise<EthersEvent[]>)[]): Promise<EthersEvent[]> {
    const events: EthersEvent[] = []
    let i = 1

    await promiseQueue(
      promiseFns,
      async (fn: () => Promise<EthersEvent[]>) => {
        const batchedEvents = await fn()
        console.log(`got batch ${i++}/${promiseFns.length}`)
        events.push(...batchedEvents)
      },
      { concurrency: 20 }
    )

    return events
  }

  private sortByBlockNumber(a: EthersEvent, b: EthersEvent): number {
    return a.blockNumber - b.blockNumber || a.logIndex - b.logIndex
  }
}

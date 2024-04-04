import { EventContext } from './types.js'
import { EventFetcher, InputFilter } from './eventFetcher/index.js'
import { chainSlugMap } from '#utils/chainSlugMap.js'
import { promiseQueue } from '@hop-protocol/sdk-core'
import { providers } from 'ethers'

export class Event<T> {
  provider: providers.Provider
  chainId: number
  batchBlocks: number
  address: string
  eventName: string

  constructor (provider: any, chainId: number, batchBlocks: number, address: string) {
    if (!provider) {
      throw new Error('expected provider')
    }
    this.provider = provider
    this.chainId = chainId
    this.batchBlocks = batchBlocks
    this.address = address
  }

  async getEventsWithFilter(filter: any, fromBlock: number, toBlock?: number): Promise<T[]> {
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

  async populateEvents<T>(events: any[]): Promise<T[]> {
    events = events.map(x => this.toTypedEvent(x))
    const promiseFns = events.map((event: any) => () => this.addContextToEvent(event, this.chainId))

    const populatedEvents : any[] = []
    await promiseQueue(promiseFns, async (fn: any) => {
      populatedEvents.push(await fn())
    }, { concurrency: 20 })

    return populatedEvents.map((event) => event as T)
  }

  toTypedEvent (ethersEvent: any): T {
    throw new Error('Not implemented')
  }

  async addContextToEvent (event: any, chainId: number): Promise<T> {
    const context = await this.getEventContext(event.eventLog, chainId)
    event.context = context
    return event
  }

  async getEventContext (event: any, chainId: number): Promise<EventContext> {
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
        chainId,
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
    } catch (err: any) {
      console.log('getEventContext error:', err, chainId, event)
      throw err
    }
  }

  getChainSlug (chainId: number): string {
    const chainSlug = chainSlugMap[chainId]
    if (!chainSlug) {
      throw new Error(`Invalid chain: ${chainId}`)
    }
    return chainSlug
  }
}

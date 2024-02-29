import { EventContext } from './types'
import { EventFetcher, InputFilter } from '../eventFetcher'
import { chainSlugMap } from '../utils/chainSlugMap'
import { promiseQueue } from '../promiseQueue'
import { providers } from 'ethers'

export class Event {
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

  async _getEvents (filter: any, fromBlock: number, toBlock?: number) {
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

  async populateEvents (events: any[]) {
    events = events.map(x => this.toTypedEvent(x))
    const promiseFns = events.map((event: any) => () => this.addContextToEvent(event, this.chainId))

    const populatedEvents : any[] = []
    await promiseQueue(promiseFns, async (fn: any) => {
      populatedEvents.push(await fn())
    }, { concurrency: 20 })

    return populatedEvents
  }

  toTypedEvent (ethersEvent: any): any {
    throw new Error('Not implemented')
  }

  async addContextToEvent (event: any, chainId: number): Promise<any> {
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

  getChainSlug (chainId: number) {
    const chainSlug = chainSlugMap[chainId]
    if (!chainSlug) {
      throw new Error(`Invalid chain: ${chainId}`)
    }
    return chainSlug
  }
}

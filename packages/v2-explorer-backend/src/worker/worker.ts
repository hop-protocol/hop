// import { Hop } from '@hop-protocol/v2-sdk'
import { Indexer } from '#indexer/index.js'
import { addresses } from '@hop-protocol/v2-sdk'

export type Options = {
  indexerPollSeconds?: number
}

export const defaultPollSeconds = 10

export class Worker {
  // TODO: fix sdk
  // sdk: Hop
  sdk: any
  pollIntervalMs: number = defaultPollSeconds * 1000
  indexer: Indexer

  constructor (options: Options = {}) {
    // TODO: fix sdk
    // this.sdk = new Hop({ network: 'sepolia' })
    this.indexer = new Indexer({
      pollIntervalSeconds: options.indexerPollSeconds,
      startBlocks: {
        11155111: addresses.sepolia['11155111'].startBlock,
        84532: addresses.sepolia['84532'].startBlock
      }
    })
  }

  async start () {
    try {
      this.indexer.start()
    } catch (err: any) {
      console.error('worker poll error', err)
    }
  }
}

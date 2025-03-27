import { Hop } from '@hop-protocol/v2-sdk'
import { Indexer } from '#indexer/index.js'
import { network } from '#config/index.js'

export type Options = {
  indexerPollSeconds?: number
  skipChainIds?: string[]
  syncFromTimestamp?: number
}

export const defaultPollSeconds = 10

export class Worker {
  sdk: Hop
  pollIntervalMs: number = defaultPollSeconds * 1000
  indexer: Indexer

  constructor (options: Options = {}) {
    this.sdk = new Hop({
      network: network,
      signersOrProviders: Hop.getDefaultProviders(network)
    })

    const startBlocks: any = {}

    // Initialize start blocks with default values
    Object.keys(this.sdk.contractAddresses).forEach((chainId: string) => {
      startBlocks[chainId] = this.sdk.contractAddresses[chainId].startBlock
    })

    this.indexer = new Indexer({
      pollIntervalSeconds: options.indexerPollSeconds,
      startBlocks,
      skipChainIds: options.skipChainIds,
      syncFromTimestamp: options.syncFromTimestamp
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

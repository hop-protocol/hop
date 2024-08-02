import { Logger } from '#logger/index.js'
import type { NetworkSlug, ChainSlug } from '@hop-protocol/sdk'
import { SharedConfig } from '#config/index.js'

export abstract class AbstractService {
  protected readonly chainSlug: ChainSlug
  protected readonly networkSlug: NetworkSlug
  protected readonly logger: Logger

  constructor (chainSlug: ChainSlug) {
    this.chainSlug = chainSlug
    this.networkSlug = SharedConfig.network

    // Set up config
    const prefix = `${this.chainSlug}`
    const tag = this.constructor.name
    this.logger = new Logger({
      tag,
      prefix,
      color: 'blue'
    })
  }
}

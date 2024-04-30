import { Logger } from '#logger/index.js'
import { type NetworkSlug } from '@hop-protocol/sdk'
import { CoreEnvironment } from '#config/index.js'

export abstract class AbstractService {
  protected readonly chainSlug: string
  protected readonly networkSlug: NetworkSlug
  protected readonly logger: Logger

  constructor (chainSlug: string) {
    this.chainSlug = chainSlug
    const coreEnvironmentVariables = CoreEnvironment.getInstance().getEnvironment()
    this.networkSlug = coreEnvironmentVariables.envNetwork

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

import Logger from 'src/logger'
import { getEnabledNetworks } from 'src/config'

export abstract class AbstractService {
  protected readonly chainSlug: string
  protected readonly logger: Logger

  constructor (chainSlug: string) {
    this.chainSlug = chainSlug
    const enabledNetworks = getEnabledNetworks()
    if (!enabledNetworks.includes(this.chainSlug)) {
      throw new Error(`Chain ${this.chainSlug} is not enabled`)
    }

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

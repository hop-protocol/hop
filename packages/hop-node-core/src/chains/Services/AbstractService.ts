import Logger from 'src/logger'
import { getNetworkSlugByChainSlug } from 'src/chains/utils'

export abstract class AbstractService {
  protected readonly chainSlug: string
  protected readonly networkSlug: string
  protected readonly logger: Logger

  constructor (chainSlug: string) {
    const networkSlug = getNetworkSlugByChainSlug(chainSlug)
    if (!networkSlug) {
      throw new Error(`Network slug not found for chain slug ${chainSlug}`)
    }

    this.chainSlug = chainSlug
    this.networkSlug = networkSlug

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

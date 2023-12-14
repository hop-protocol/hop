import Logger from 'src/logger'
import chainSlugToId from 'src/utils/chainSlugToId'
import wallets from 'src/wallets'
import { CacheService } from 'src/chains/Services/CacheService'
import { Chain } from 'src/constants'
import { Signer } from 'ethers'
import { getEnabledNetworks } from 'src/config'
import { getNetworkSlugByChainId } from 'src/chains/utils'

export interface IAbstractService {
  getLogger(): Logger
}

export abstract class AbstractService extends CacheService implements IAbstractService {
  protected readonly chainSlug: string
  protected readonly networkSlug: string
  protected readonly logger: Logger
  protected readonly l1Wallet: Signer
  protected readonly l2Wallet: Signer

  constructor (chainSlug: string) {
    super()

    this.chainSlug = chainSlug
    const enabledNetworks = getEnabledNetworks()
    if (!enabledNetworks.includes(this.chainSlug)) {
      throw new Error(`Chain ${this.chainSlug} is not enabled`)
    }

    // Set up config
    const chainId = chainSlugToId(this.chainSlug)
    const networkSlug = getNetworkSlugByChainId(chainId)
    if (!networkSlug) {
      throw new Error(`Network slug not found for chain id ${chainId}`)
    }
    this.networkSlug = networkSlug

    const prefix = `${this.chainSlug}`
    const tag = this.constructor.name
    this.logger = new Logger({
      tag,
      prefix,
      color: 'blue'
    })

    // Set up signers
    this.l1Wallet = wallets.get(Chain.Ethereum)
    this.l2Wallet = wallets.get(this.chainSlug)
  }

  getLogger (): Logger {
    return this.logger
  }
}

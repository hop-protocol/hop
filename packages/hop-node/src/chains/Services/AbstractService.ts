import Logger from 'src/logger'
import wallets from 'src/wallets'
import { Chain } from 'src/constants'
import { Signer } from 'ethers'
import { getEnabledNetworks } from 'src/config'

export abstract class AbstractService {
  protected readonly chainSlug: string
  protected readonly l1Wallet: Signer
  protected readonly l2Wallet: Signer
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

    // Set up signers
    this.l1Wallet = wallets.get(Chain.Ethereum)
    this.l2Wallet = wallets.get(this.chainSlug)
  }
}

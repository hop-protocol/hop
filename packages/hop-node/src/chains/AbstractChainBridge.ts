import Logger from 'src/logger'
import chainSlugToId from 'src/utils/chainSlugToId'
import wallets from 'src/wallets'
import { Chain } from 'src/constants'
import { IAbstractChainBridge } from './IAbstractChainBridge'
import { Signer } from 'ethers'
import { getEnabledNetworks } from 'src/config'

abstract class AbstractChainBridge implements IAbstractChainBridge {
  logger: Logger
  chainSlug: string
  chainId: number
  l1Wallet: Signer
  l2Wallet: Signer

  constructor (chainSlug: string) {
    const enabledNetworks = getEnabledNetworks()
    if (!enabledNetworks.includes(chainSlug)) {
      throw new Error(`Chain ${chainSlug} is not enabled`)
    }

    // Set up config
    this.chainSlug = chainSlug
    this.chainId = chainSlugToId(chainSlug)
    const prefix = `${this.chainSlug}`
    const tag = this.constructor.name
    this.logger = new Logger({
      tag,
      prefix,
      color: 'blue'
    })

    // Set up signers
    this.l1Wallet = wallets.get(Chain.Ethereum)
    this.l2Wallet = wallets.get(chainSlug)
  }

  getLogger (): Logger {
    return this.logger
  }
}

export default AbstractChainBridge

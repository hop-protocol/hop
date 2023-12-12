import Logger from 'src/logger'
import chainSlugToId from 'src/utils/chainSlugToId'
import wallets from 'src/wallets'
import { Chain } from 'src/constants'
import { IAbstractChainBridge } from './IAbstractChainBridge'
import { Signer } from 'ethers'
import { getEnabledNetworks } from 'src/config'

type Cache = {
  lastCacheTimestampMs: number
  cacheValue: number
}

abstract class AbstractChainBridge implements IAbstractChainBridge {
  logger: Logger
  chainSlug: string
  chainId: number
  l1Wallet: Signer
  l2Wallet: Signer
  #cache: Record<string, Cache> = {}

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
    this.#cache = {}
  }

  getLogger (): Logger {
    return this.logger
  }

  protected isCacheExpired (cacheKey: string): boolean {
    // If it has not been set, it is considered expired
    if (this.#cache?.[cacheKey]?.lastCacheTimestampMs === 0) {
      return true
    }

    const now = Date.now()
    const cacheExpirationTimeMs = 60 * 1000
    const lastCacheTimestampMs = this.#cache[cacheKey].lastCacheTimestampMs
    return now - lastCacheTimestampMs > cacheExpirationTimeMs
  }

  protected updateCache (cacheKey: string, cacheValue: number): void {
    this.#cache[cacheKey] = {
      lastCacheTimestampMs: Date.now(),
      cacheValue
    }
  }

  protected getCacheValue (cacheKey: string): number | undefined {
    return this.#cache[cacheKey]?.cacheValue
  }
}

export default AbstractChainBridge

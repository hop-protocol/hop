type Cache = {
  lastCacheTimestampMs: number
  cacheValue: number
}

export abstract class CacheService {
  #cache: Record<string, Cache> = {}

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

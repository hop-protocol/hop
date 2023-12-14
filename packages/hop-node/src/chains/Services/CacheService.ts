type Cache = {
  lastCacheTimestampMs: number
  cacheValue: number
}

export class CacheService {
  #cache: Record<string, Cache> = {}

  isCacheExpired (cacheKey: string): boolean {
    // If it has not been set, it is considered expired
    if (this.#cache?.[cacheKey]?.lastCacheTimestampMs === 0) {
      return true
    }

    const now = Date.now()
    const cacheExpirationTimeMs = 60 * 1000
    const lastCacheTimestampMs = this.#cache[cacheKey].lastCacheTimestampMs
    return now - lastCacheTimestampMs > cacheExpirationTimeMs
  }

  updateCache (cacheKey: string, cacheValue: number): void {
    this.#cache[cacheKey] = {
      lastCacheTimestampMs: Date.now(),
      cacheValue
    }
  }

  getCacheValue (cacheKey: string): number | undefined {
    return this.#cache[cacheKey]?.cacheValue
  }
}

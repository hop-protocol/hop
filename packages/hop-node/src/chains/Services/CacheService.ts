type Cache = {
  lastTimestampMs: number
  value: number
}

export class CacheService {
  #cache: Record<string, Cache> = {}
  #expirationTimeMs: number = 60 * 1000

  set (cacheKey: string, value: number): void {
    this.#cache[cacheKey] = {
      lastTimestampMs: Date.now(),
      value
    }
  }

  get (cacheKey: string): number | undefined {
    if (
      !this.#doesCacheExist(cacheKey) ||
      this.#isCacheExpired(cacheKey)
    ){
      return
    }
    return this.#cache[cacheKey].value
  }

  #doesCacheExist (cacheKey: string): boolean {
    return !!this.#cache?.[cacheKey]?.value
  }

  #isCacheExpired (cacheKey: string): boolean {
    // If it has not been set, it is considered expired
    if (!this.#cache?.[cacheKey]?.lastTimestampMs) {
      return true
    }

    const now = Date.now()
    const lastTimestampMs = this.#cache[cacheKey].lastTimestampMs
    return now - lastTimestampMs > this.#expirationTimeMs
  }
}

import { stableCoins } from '#utils/constants.js'
import { useApp } from '#contexts/AppContext/index.js'
import { useQuery } from 'react-query'
import type { Hop } from '@hop-protocol/sdk'

interface TokenPriceResult {
  tokenSymbol: string
  priceUsd: number | null
  isLoading: boolean
  error: Error | null
}

const PRICE_REFETCH_INTERVAL = 60 * 1000 // 1 minute in milliseconds
const PRICE_STALE_TIME = 30 * 1000 // 30 seconds
const PRICE_CACHE_TIME = 5 * 60 * 1000 // 5 minutes
const RETRY_ATTEMPTS = 3

export function useTokenPrice(tokenSymbol: string): TokenPriceResult {
  const { sdk } = useApp()

  const {
    data: priceUsd,
    isLoading,
    error
  } = useQuery(
    ['tokenPrice', tokenSymbol],
    async (): Promise<number> => {
      if (!tokenSymbol) {
        throw new Error('Token symbol is required')
      }

      if (stableCoins.has(tokenSymbol)) {
        return 1
      }

      try {
        const hopSdk = sdk as Hop
        const bridge = hopSdk.bridge('ETH')
        const price = await bridge.priceFeed.getPriceByTokenSymbol(tokenSymbol)
        
        if (typeof price !== 'number' || isNaN(price)) {
          throw new Error(`Invalid price returned for ${tokenSymbol}`)
        }

        return price
      } catch (err) {
        console.error(`Error fetching price for ${tokenSymbol}:`, err)
        throw err
      }
    },
    {
      enabled: Boolean(tokenSymbol),
      refetchInterval: PRICE_REFETCH_INTERVAL,
      retry: RETRY_ATTEMPTS,
      staleTime: PRICE_STALE_TIME,
      cacheTime: PRICE_CACHE_TIME,
    }
  )

  return {
    tokenSymbol,
    priceUsd: priceUsd ?? null,
    isLoading,
    error: error as Error | null
  }
}

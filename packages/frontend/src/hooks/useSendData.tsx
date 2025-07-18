import Network from '#models/Network.js'
import { BigNumber } from 'ethers'
import { Token } from '@hop-protocol/sdk'
import { useApp } from '#contexts/AppContext/index.js'
import { useMemo, useCallback } from 'react'
import { useQuery } from 'react-query'

// Constants
const REFETCH_INTERVAL = 30 * 1000 // 30 seconds
const STALE_TIME = 10 * 1000 // 10 seconds
const CACHE_TIME = 60 * 1000 // 1 minute
const MAX_RETRIES = 2
const BPS_DENOMINATOR = 10000

// Helper function for calculating min amounts
const calculateMinAmount = (amount: BigNumber | undefined, slippageToleranceBps: number) => {
  if (!amount) return undefined
  const minBps = Math.ceil(BPS_DENOMINATOR - slippageToleranceBps)
  return amount.mul(minBps).div(BPS_DENOMINATOR)
}

const useSendData = (
  token?: Token,
  slippageTolerance?: number,
  fromNetwork?: Network,
  toNetwork?: Network,
  fromAmount?: BigNumber
) => {
  const { sdk } = useApp()

  // Memoize the bridge instance
  const bridge = useMemo(() => {
    if (!token?.symbol) return null
    return sdk.bridge(token.symbol)
  }, [sdk, token?.symbol])

  // Memoize the query key to prevent unnecessary cache invalidation
  const queryKey = useMemo(() => [
    'sendData',
    token?.symbol,
    token?.address,
    fromNetwork?.slug,
    toNetwork?.slug,
    fromAmount?.toString()
  ], [token?.symbol, token?.address, fromNetwork?.slug, toNetwork?.slug, fromAmount])

  // Memoize the check for deprecated route
  const isDeprecatedRoute = useMemo(() => {
    if (!(fromNetwork && toNetwork && token?.symbol && bridge)) return false
    return ['USDC', 'USDC.e', 'MAGIC'].includes(token.symbol) && 
           !bridge.getIsSupportedCctpRoute(fromNetwork.slug, toNetwork.slug)
  }, [bridge, token?.symbol, fromNetwork?.slug, toNetwork?.slug])

  // Memoize the enabled condition
  const isQueryEnabled = useMemo(() => (
    !!token?.address && 
    !!fromNetwork?.slug && 
    !!toNetwork?.slug && 
    !!fromAmount?.toString() &&
    !isDeprecatedRoute
  ), [token?.address, fromNetwork?.slug, toNetwork?.slug, fromAmount, isDeprecatedRoute])

  // Memoize the fetch function
  const fetchSendData = useCallback(async () => {
    if (!isQueryEnabled || !bridge || !(token && fromNetwork && toNetwork && fromAmount)) {
      return undefined
    }

    try {
      return await bridge.getSendData(fromAmount, fromNetwork.slug, toNetwork.slug)
    } catch (error) {
      console.error('Error fetching send data:', error)
      throw error
    }
  }, [isQueryEnabled, bridge, token, fromNetwork, toNetwork, fromAmount])

  const { isLoading, data, error } = useQuery(
    queryKey,
    fetchSendData,
    {
      enabled: isQueryEnabled,
      refetchInterval: REFETCH_INTERVAL,
      staleTime: STALE_TIME,
      cacheTime: CACHE_TIME,
      retry: MAX_RETRIES,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      onError: (error) => {
        console.error('Send data query error:', error)
      }
    }
  )

  // Memoize slippage calculations
  const slippageToleranceBps = useMemo(() => 
    slippageTolerance ? slippageTolerance * 100 : 0,
    [slippageTolerance]
  )

  const amountOutMin = useMemo(() => 
    calculateMinAmount(data?.amountOut, slippageToleranceBps),
    [data?.amountOut, slippageToleranceBps]
  )

  const intermediaryAmountOutMin = useMemo(() => 
    calculateMinAmount(data?.requiredLiquidity, slippageToleranceBps),
    [data?.requiredLiquidity, slippageToleranceBps]
  )

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(() => ({
    ...data,
    amountOutMin,
    intermediaryAmountOutMin,
    loading: isLoading,
    error
  }), [data, amountOutMin, intermediaryAmountOutMin, isLoading, error])
}

export default useSendData

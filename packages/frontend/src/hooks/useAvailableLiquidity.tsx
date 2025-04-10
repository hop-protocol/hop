import { BigNumber } from 'ethers'
import { ChainSlug, HopBridge } from '@hop-protocol/sdk'
import { getNativeTokenSymbol } from '#utils/getNativeTokenSymbol.js'
import { useQuery } from 'react-query'
import { useMemo, useCallback } from 'react'

// Move this outside the component to prevent recreation
const REFETCH_INTERVAL = 20 * 1000

function disableNativeAssetTransfers(sourceChain: string, tokenSymbol: string) {
  const nativeTokenSymbol = getNativeTokenSymbol(sourceChain)
  if (tokenSymbol === nativeTokenSymbol) {
    return true
  }

  // check for both XDAI and DAI on Gnosis chain
  if (sourceChain === ChainSlug.Gnosis && tokenSymbol === 'DAI') {
    return true
  }

  return false
}

const useAvailableLiquidity = (
  bridge?: HopBridge,
  sourceChain?: string,
  destinationChain?: string
) => {
  const tokenSymbol = bridge?.getTokenSymbol()

  // Memoize the disableNativeAssetTransfers function
  const checkDisableNativeAssetTransfers = useCallback((sourceChain: string, tokenSymbol: string) => {
    const nativeTokenSymbol = getNativeTokenSymbol(sourceChain)
    if (tokenSymbol === nativeTokenSymbol) {
      return true
    }

    // check for both XDAI and DAI on Gnosis chain
    if (sourceChain === ChainSlug.Gnosis && tokenSymbol === 'DAI') {
      return true
    }

    return false
  }, [])

  // Memoize the queryKey to prevent unnecessary query cache invalidation
  const queryKey = useMemo(() => 
    ['availableLiquidity', tokenSymbol, sourceChain, destinationChain],
    [tokenSymbol, sourceChain, destinationChain]
  )

  // Memoize the async query function
  const fetchLiquidity = useCallback(async () => {
    if (sourceChain && destinationChain && tokenSymbol) {
      const isDeprecatedRoute = sourceChain && destinationChain && 
        ['USDC', 'USDC.e', 'MAGIC'].includes(tokenSymbol) && 
        !bridge?.getIsSupportedCctpRoute(sourceChain, destinationChain)

      if (isDeprecatedRoute) {
        return BigNumber.from(0)
      }

      const liquidity = await bridge?.getFrontendAvailableLiquidity(sourceChain, destinationChain)
      const shouldDisableNativeAssetTransfers =
        process.env.REACT_APP_DISABLE_NATIVE_ASSET_TRANSFERS === 'true' &&
        checkDisableNativeAssetTransfers(sourceChain, tokenSymbol)

      return shouldDisableNativeAssetTransfers ? BigNumber.from(0) : liquidity
    }
  }, [bridge, sourceChain, destinationChain, tokenSymbol, checkDisableNativeAssetTransfers])

  const { isLoading, data, error } = useQuery(
    queryKey,
    fetchLiquidity,
    {
      enabled: !!bridge && !!tokenSymbol && !!sourceChain && !!destinationChain,
      refetchInterval: REFETCH_INTERVAL,
      staleTime: 60000, // Consider data fresh for 1 minute
      cacheTime: REFETCH_INTERVAL, // Cache the data for the same duration as refetch interval
      retry: 2, // Retry failed requests twice
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
    }
  )

  return {
    availableLiquidity: data,
    isLoading,
    error,
  }
}

export default useAvailableLiquidity

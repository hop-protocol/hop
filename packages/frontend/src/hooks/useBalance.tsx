import { Addressish } from '#models/Address.js'
import { Token } from '@hop-protocol/sdk'
import { Contract } from 'ethers'
import { StakingRewards } from '@hop-protocol/sdk/contracts'
import { useQuery } from 'react-query'
import { useMemo, useCallback } from 'react'

// Constants
const REFETCH_INTERVAL = 15 * 1000 // 15 seconds
const STALE_TIME = 5 * 1000 // 5 seconds
const CACHE_TIME = 60 * 1000 // 1 minute

type ContractType = Token | StakingRewards | Contract

// Move fetchBalance outside component and memoize with useCallback inside
const useBalance = (token?: ContractType, address?: Addressish, chainId?: string) => {
  // Get chainId from token if available
  const effectiveChainId = useMemo(() => 
    token instanceof Token ? token.chain.chainId : chainId,
    [token, chainId]
  )

  // Memoize the query key array to prevent unnecessary cache invalidation
  const queryKey = useMemo(() => [
    'balance',
    effectiveChainId,
    token?.address,
    address?.toString()
  ], [effectiveChainId, token?.address, address])

  // Memoize the fetch function
  const fetchBalanceForAddress = useCallback(async () => {
    if (!token || !address) {
      return null
    }
    try {
      const balance = await token.balanceOf(address.toString())
      // console.log('balance', balance)
      return balance
    } catch (error) {
      console.error('Error fetching balance:', error)
      throw error
    }
  }, [token, address])

  const { isLoading, isError, data: balance, error } = useQuery(
    queryKey,
    fetchBalanceForAddress,
    {
      enabled: !!effectiveChainId && !!token?.address && !!address?.toString(),
      refetchInterval: REFETCH_INTERVAL,
      staleTime: STALE_TIME,
      cacheTime: CACHE_TIME,
      retry: 2,
      refetchOnWindowFocus: true, // Keep this true for balances as they're critical data
      refetchOnMount: true,
      keepPreviousData: true, // Keep showing previous balance while fetching new one
    }
  )

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(() => ({
    loading: isLoading,
    isError,
    balance,
    error
  }), [isLoading, isError, balance, error])
}

export default useBalance

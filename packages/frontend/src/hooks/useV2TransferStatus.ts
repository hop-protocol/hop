import { useMemo, useCallback } from 'react'
import { useWeb3Context } from '#contexts/Web3Context.js'
import { useApp } from '#contexts/AppContext/index.js'
import { utils } from 'ethers'
import { useQuery } from 'react-query'
import { useV2 } from './useV2.js'
import { Hop, utils as v2Utils } from '@hop-protocol/v2-sdk'

// Constants
const REFETCH_INTERVAL = 15 * 1000 // 15 seconds
const STALE_TIME = 2 * 1000 // 2 seconds
const CACHE_TIME = 30 * 1000 // 30 seconds
const MAX_RETRIES = 2

const { formatUnits, parseUnits } = utils
const { formatUSD } = v2Utils

type V2SendHook = {
  v2Sdk: Hop
  transferStatus: any
  isLoading: boolean
  error: any
}

type Props = {
  transactionHash: string
  fromChainId: string
  toChainId: string
}

export function useV2TransferStatus({ transactionHash, fromChainId, toChainId }: Props): V2SendHook {
  const { v2Sdk } = useV2()
  const { networks, txConfirm } = useApp()
  const { address } = useWeb3Context()

  // Memoize the query key to prevent unnecessary cache invalidation
  const queryKey = useMemo(() => [
    'transferStatus',
    transactionHash,
    fromChainId,
    toChainId
  ], [transactionHash, fromChainId, toChainId])

  // Memoize the rails gateway instance
  const railsGateway = useMemo(() => {
    if (!v2Sdk || !fromChainId) return null
    try {
      return v2Sdk.getRailsGateway(fromChainId)
    } catch (error) {
      console.error('Error getting rails gateway:', error)
      return null
    }
  }, [v2Sdk, fromChainId])

  // Memoize the enabled condition
  const isQueryEnabled = useMemo(() => (
    !!fromChainId &&
    !!toChainId &&
    !!transactionHash &&
    !!railsGateway
  ), [fromChainId, toChainId, transactionHash, railsGateway])

  // Memoize the fetch function
  const fetchTransferStatus = useCallback(async () => {
    if (!isQueryEnabled || !railsGateway || !v2Sdk) {
      return null
    }

    try {
      // Get transfer event
      const event = await railsGateway.helpers.getTransferSentEventFromTransactionHash({
        transactionHash
      })

      if (!event) {
        console.debug('No transfer event found for hash:', transactionHash)
        return null
      }

      // Get transfer status
      const transferId = event.decoded.transferId
      const status = await v2Sdk.getTransferStatus({
        fromChainId,
        toChainId,
        transferId
      })

      console.debug('Transfer status:', status)
      return status
    } catch (error) {
      console.error('Error fetching transfer status:', error)
      throw error
    }
  }, [isQueryEnabled, railsGateway, v2Sdk, transactionHash, fromChainId, toChainId])

  const { isLoading, data: transferStatus, error } = useQuery(
    queryKey,
    fetchTransferStatus,
    {
      enabled: isQueryEnabled,
      refetchInterval: REFETCH_INTERVAL,
      staleTime: STALE_TIME,
      cacheTime: CACHE_TIME,
      retry: MAX_RETRIES,
      refetchOnWindowFocus: true, // Keep true since transfer status is important real-time data
      keepPreviousData: true,
      onError: (error) => {
        console.error('Transfer status query error:', error)
      }
    }
  )

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(() => ({
    v2Sdk,
    transferStatus,
    isLoading,
    error
  }), [v2Sdk, transferStatus, isLoading, error])
}

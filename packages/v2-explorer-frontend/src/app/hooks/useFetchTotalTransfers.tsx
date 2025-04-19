import { useQuery } from 'react-query'
import { apiUrl } from '@/app/config'

type TotalTransfersStats = {
  stats: {
    count: string
  }
  lastUpdated: string
}

const fetchTotalTransfers = async (): Promise<TotalTransfersStats> => {
  const response = await fetch(`${apiUrl}/v1/stats/total-transfers`)
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }
  const data = await response.json()
  console.log('Total transfers API response:', data)
  return {
    stats: {
      count: data.stats.count
    },
    lastUpdated: data.lastUpdated
  }
}

export const useFetchTotalTransfers = (): { totalTransfersStats: TotalTransfersStats | null, loading: boolean, error: string | null } => {
  const { data, isLoading, error } = useQuery<TotalTransfersStats, Error>('totalTransfers', fetchTotalTransfers, {
    refetchInterval: 60 * 1000,
  })

  console.log('Total transfers hook state:', { data, isLoading, error })

  return {
    totalTransfersStats: data || null,
    loading: isLoading,
    error: error ? error.message : null
  }
} 
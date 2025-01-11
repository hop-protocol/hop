import { useQuery } from 'react-query'
import { apiUrl } from '@/app/config'

type VolumeStats = {
  stats: {
    totalVolume: {
      totalUsd: number
      totalUsdDisplay: string
    }
    tokenVolumes: Record<string, {
      totalUsd: number
      totalUsdDisplay: string
    }>
  }
}

const fetchVolumeStats = async (): Promise<VolumeStats> => {
  const response = await fetch(`${apiUrl}/v1/stats/volume`)
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }
  return response.json()
}

export const useFetchVolumeStats = (): { volumeStats: VolumeStats | null, loading: boolean, error: string | null } => {
  const { data, isLoading, error } = useQuery<VolumeStats, Error>('volumeStats', fetchVolumeStats, {
    refetchInterval: 60 * 1000,
  })

  return {
    volumeStats: data || null,
    loading: isLoading,
    error: error ? error.message : null
  }
}

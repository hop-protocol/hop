import { useQuery } from 'react-query'
import { apiUrl, appApiHost } from '@/app/config'

type VolumeByChainStats = {
  datasets: Array<{
    label: string
    data: Array<{
      x: string
      y: string
    }>
    tokenSymbol: string
    tokenDecimals: number
  }>
}

const fetchVolumeByChain = async (days: number = 30): Promise<VolumeByChainStats> => {
  // Use the API proxy when in the browser to avoid CORS issues
  const hostname = typeof window === 'undefined' ? appApiHost : window.location.host
  const protocol = hostname.includes('localhost') ? 'http' : 'https'
  
  let url = `${protocol}://${hostname}/api/?pathname=/stats/volume-by-chain?days=${days}`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch volume by chain stats')
  }
  return response.json()
}

export const useFetchVolumeByChain = (days: number = 30) => {
  return useQuery<VolumeByChainStats, Error>({
    queryKey: ['volumeByChain', days],
    queryFn: () => fetchVolumeByChain(days),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  })
} 
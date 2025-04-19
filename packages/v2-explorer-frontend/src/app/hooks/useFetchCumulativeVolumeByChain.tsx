import { useQuery } from 'react-query'
import { apiUrl, appApiHost } from '@/app/config'

interface CumulativeVolumeByChainStats {
  datasets: {
    chainId: number
    chainName: string
    data: {
      date: string
      volume: string
      volumeUsd: number
    }[]
    priceUsd: number
  }[]
}

const fetchCumulativeVolumeByChain = async (days: number) => {
    // Use the API proxy when in the browser to avoid CORS issues
    const hostname = typeof window === 'undefined' ? appApiHost : window.location.host
    const protocol = hostname.includes('localhost') ? 'http' : 'https'
    
    let url = `${protocol}://${hostname}/api/?pathname=/stats/cumulative-volume-by-chain&days=${days}`

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch cumulative volume by chain')
    }
    return response.json()
}

export const useFetchCumulativeVolumeByChain = (days: number) => {
  return useQuery<CumulativeVolumeByChainStats>(
    ['cumulativeVolumeByChain', days],
    () => fetchCumulativeVolumeByChain(days),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
    }
  )
}
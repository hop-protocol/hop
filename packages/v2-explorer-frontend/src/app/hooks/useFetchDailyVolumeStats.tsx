import { useQuery } from 'react-query'
import { apiUrl, appApiHost } from '@/app/config'

type DailyVolumeStatsProps = {
  days?: number
  pathId?: string
  startTimestamp?: number
  endTimestamp?: number
}

type DailyVolumeStats = {
  data: {
    labels: string[]  // dates
    datasets: Array<{
      label: string   // token symbol
      data: number[]  // token amount values
    }>
    rawData: Array<{
      date: string
      tokenSymbol: string
      tokenDecimals: number
      volume: string
      volumeFormatted: string
    }>
  }
  lastUpdated: string
}

// Helper function to format token amounts correctly
function formatTokenAmount(value: string, decimals: number): number {
  try {
    // For raw token amounts in their smallest unit (e.g. wei for ETH)
    if (!value || value === '0') return 0;
    
    const valueStr = value.toString();
    
    // If the value is less than 1 * 10^decimals, we need to handle fractional values
    if (valueStr.length <= decimals) {
      const fractionalPart = valueStr.padStart(decimals, '0');
      return Number(`0.${fractionalPart}`);
    }
    
    // Otherwise, insert the decimal point at the appropriate position
    const integerPart = valueStr.slice(0, valueStr.length - decimals);
    const fractionalPart = valueStr.slice(valueStr.length - decimals);
    
    return Number(`${integerPart}.${fractionalPart}`);
  } catch (error) {
    console.error('Error formatting token amount:', error, value, decimals);
    return 0;
  }
}

const fetchDailyVolumeStats = async (options: DailyVolumeStatsProps = {}): Promise<DailyVolumeStats> => {
  const { days, pathId, startTimestamp, endTimestamp } = options
  
  // Use the API proxy when in the browser to avoid CORS issues
  const hostname = typeof window === 'undefined' ? appApiHost : window.location.host
  const protocol = hostname.includes('localhost') ? 'http' : 'https'
  
  let url = `${protocol}://${hostname}/api/?pathname=/stats/daily-volume`
  
  // Add query parameters
  if (days) url += `&days=${days}`
  if (pathId) url += `&pathId=${pathId}`
  if (startTimestamp) url += `&startTimestamp=${startTimestamp}`
  if (endTimestamp) url += `&endTimestamp=${endTimestamp}`
  
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }
  
  const data = await response.json()
  
  console.log('Raw API response:', data);
  
  // Process the data to ensure token amounts are properly formatted
  if (data.data && data.data.rawData) {
    data.data.rawData.forEach((item: any) => {
      // Add formatted volume if not already present
      if (!item.volumeFormatted) {
        item.volumeFormatted = formatTokenAmount(item.volume, parseInt(item.tokenDecimals)).toString();
      }
    });
    
    // Update datasets to use formatted values
    if (data.data.datasets) {
      // Create unique sets of dates and tokens
      const dateSet = new Set<string>();
      const tokenSet = new Set<string>();
      
      data.data.rawData.forEach((item: any) => {
        dateSet.add(item.date);
        tokenSet.add(item.tokenSymbol);
      });
      
      // Convert sets to arrays and sort
      const uniqueDates = Array.from(dateSet).sort();
      const uniqueTokens = Array.from(tokenSet);
      
      // Create datasets based on properly formatted token amounts
      data.data.datasets = uniqueTokens.map(tokenSymbol => {
        // For each date, find the formatted volume for this token (or 0 if none)
        const tokenData = uniqueDates.map(date => {
          const item = data.data.rawData.find(
            (item: any) => item.date === date && item.tokenSymbol === tokenSymbol
          );
          return item ? Number(item.volumeFormatted) : 0;
        });
        
        return {
          label: tokenSymbol,
          data: tokenData
        };
      });
      
      // Ensure labels are in correct order
      data.data.labels = uniqueDates;
    }
  }
  
  return data
}

export const useFetchDailyVolumeStats = (options: DailyVolumeStatsProps = {}): { 
  dailyVolumeStats: DailyVolumeStats | null, 
  loading: boolean, 
  error: string | null
} => {
  const queryKey = [
    'dailyVolumeStats',
    options.days,
    options.pathId,
    options.startTimestamp,
    options.endTimestamp
  ]
  
  const { data, isLoading, error } = useQuery<DailyVolumeStats, Error>(
    queryKey,
    () => fetchDailyVolumeStats(options),
    {
      refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
      staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    }
  )

  return {
    dailyVolumeStats: data || null,
    loading: isLoading,
    error: error ? error.message : null
  }
} 
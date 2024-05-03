import { getChain } from '@hop-protocol/sdk'
import { getTransferTimeSeconds } from 'src/utils/getTransferTimeSeconds'
import { useApp } from 'src/contexts/AppContext'
import { useEffect, useRef, useState } from 'react'

// return statistical data in whole minutes given recent transaction times
export const useTransferTimeEstimate = (sourceChainSlug?: string | null, destinationChainSlug?: string | null, tokenSymbol?: string) => {
  const { sdk } = useApp()

  const fixedTimeEstimate = sourceChainSlug && destinationChainSlug ? getTransferTimeSeconds(sourceChainSlug, destinationChainSlug) : 0

  const [averageTimeEstimate, setAverageTimeEstimate] = useState<number | null>(null)
  const [medianTimeEstimate, setMedianTimeEstimate] = useState<number | null>(null)
  const [percentileTimeEstimate, setPercentileTimeEstimate] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const cache = useRef<{ lastFetched: number; data: any, route: string }>({
    route: '',
    lastFetched: 0,
    data: null,
  })

  useEffect(() => {
    const fetchData = async () => {
      const currentTime = Date.now()
      const route = `${sourceChainSlug}-${destinationChainSlug}`
      if (
        cache.current.route === route &&
        cache.current.lastFetched &&
        cache.current.data &&
        (currentTime - cache.current.lastFetched < 60000)
      ) {
        const { average, median, percentile90 } = cache.current.data
        setAverageTimeEstimate(average)
        setMedianTimeEstimate(median)
        setPercentileTimeEstimate(percentile90)
        return
      }

      setIsLoading(true)
      if (sourceChainSlug && destinationChainSlug) {
        let historicalTimeStats : any

        try {
          historicalTimeStats = await sdk.getTransferTimes(sourceChainSlug, destinationChainSlug, tokenSymbol)
        } catch (error: any) {
          console.error('Failed to fetch time estimates:', error)
          return
        }

        cache.current.route = route
        cache.current.lastFetched = currentTime
        cache.current.data = historicalTimeStats

        setAverageTimeEstimate(historicalTimeStats.avg)
        setMedianTimeEstimate(historicalTimeStats.median)
        setPercentileTimeEstimate(historicalTimeStats.percentile90)
      }
      setIsLoading(false)
    }
    fetchData().catch(console.error)
  }, [sourceChainSlug, destinationChainSlug])

  return { fixedTimeEstimate, averageTimeEstimate, medianTimeEstimate, percentileTimeEstimate, isLoading }
}

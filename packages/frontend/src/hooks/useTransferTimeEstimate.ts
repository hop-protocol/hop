import { useState, useEffect, useRef } from 'react'
import { Chain } from '@hop-protocol/sdk'
import { useApp } from 'src/contexts/AppContext'
import { getTransferTimeMinutes } from 'src/utils/getTransferTimeMinutes'

// return statistical data in whole minutes given recent transaction times
export const useTransferTimeEstimate = (sourceChainSlug, destinationChainSlug) => {
  const { sdk } = useApp()
  
  const sourceChain = sourceChainSlug ? Chain.fromSlug(sourceChainSlug) : null
  const destinationChain = destinationChainSlug ? Chain.fromSlug(destinationChainSlug) : null
  const fixedTimeEstimate = sourceChain && destinationChain ? getTransferTimeMinutes(sourceChain?.slug, destinationChain?.slug) : ''
  
  const [averageTimeEstimate, setAverageTimeEstimate] = useState<number | null>(null)
  const [medianTimeEstimate, setMedianTimeEstimate] = useState<number | null>(null)
  const [percentileTimeEstimate, setPercentileTimeEstimate] = useState<number | null>(null)

  const cache = useRef<{ lastFetched: number | null; data: any | null }>({
    lastFetched: null,
    data: null,
  })

  useEffect(() => {
    const fetchData = async () => {
      const currentTime = Date.now()
      if (
        cache.current.lastFetched && 
        cache.current.data &&
        (currentTime - cache.current.lastFetched < 60000)
      ) {
        const { average, median, percentile90 } = cache.current.data
        setAverageTimeEstimate(Math.round(average / 60))
        setMedianTimeEstimate(Math.round(median / 60))
        setPercentileTimeEstimate(Math.round(percentile90 / 60))
        return
      }

      if (sourceChainSlug && destinationChainSlug) {
        let historicalTimeStats

        try {
          historicalTimeStats = await sdk.getTransferTimes(sourceChainSlug, destinationChainSlug)
        } catch (error) {
          console.error('Failed to fetch time estimates:', error)
          return
        }

        cache.current.lastFetched = currentTime
        cache.current.data = historicalTimeStats

        const averageMinutes = Math.round(historicalTimeStats.avg / 60)
        setAverageTimeEstimate(averageMinutes)

        const medianMinutes = Math.round(historicalTimeStats.median / 60)
        setMedianTimeEstimate(medianMinutes)

        const percentileMinutes = Math.round(historicalTimeStats.percentile90 / 60)
        setPercentileTimeEstimate(percentileMinutes)
      }
    }
    fetchData().catch(console.error)
  }, [sourceChain, destinationChain])

  return { fixedTimeEstimate, averageTimeEstimate, medianTimeEstimate, percentileTimeEstimate }
}

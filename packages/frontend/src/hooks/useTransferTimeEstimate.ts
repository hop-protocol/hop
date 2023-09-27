import { useState, useEffect } from 'react'
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

  useEffect(() => {
    const fetchData = async () => {
      if (sourceChainSlug && destinationChainSlug) {
        let historicalTimeStats

        try {
          historicalTimeStats = await sdk.getTransferTimes(sourceChainSlug, destinationChainSlug)
        } catch (error) {
          console.error('Failed to fetch time estimates:', error)
          return
        }

        const averageMinutes = Math.round(historicalTimeStats.avg / 60)
        setAverageTimeEstimate(averageMinutes)

        const medianMinutes = Math.round(historicalTimeStats.median / 60)
        setMedianTimeEstimate(medianMinutes)

        const percentileMinutes = Math.round(historicalTimeStats.percentile90 / 60)
        setPercentileTimeEstimate(percentileMinutes)
      }
    }
    fetchData()
  }, [sourceChain, destinationChain])

  return { fixedTimeEstimate, averageTimeEstimate, medianTimeEstimate, percentileTimeEstimate }
}
import { Request, Response } from 'express'
import { TransferSentTable } from './events/railsGateway/TransferSent.js'
import { DailyVolumeStatsResult } from './events/railsGateway/TransferSent.js'

interface ChainVolumeData {
  date: string
  chainId: number
  chainName: string
  volume: string
}

interface GroupedChainData {
  [chainId: string]: ChainVolumeData[]
}

class Controller {
  private transferSentTable: TransferSentTable

  constructor(transferSentTable: TransferSentTable) {
    this.transferSentTable = transferSentTable
  }

  async getCumulativeVolumeByChainStatsForApi(req: Request, res: Response): Promise<void> {
    try {
      const days = parseInt(req.query.days as string) || 30
      const startTimestamp = req.query.startTimestamp ? parseInt(req.query.startTimestamp as string) : undefined
      const endTimestamp = req.query.endTimestamp ? parseInt(req.query.endTimestamp as string) : undefined

      const results = await this.transferSentTable.getCumulativeVolumeByChainStats({
        days,
        startTimestamp,
        endTimestamp
      })

      if (!results || results.length === 0) {
        res.json({ datasets: [] })
        return
      }

      // Group results by chain with proper type assertion
      const groupedResults = results.reduce((acc: GroupedChainData, curr: ChainVolumeData) => {
        const chainId = curr.chainId.toString()
        if (chainId === undefined) {
          return acc
        }
        if (!acc[chainId]) {
          acc[chainId] = []
        }
        acc[chainId].push(curr)
        return acc
      }, {})

      // Format the response with proper type assertions
      const response = {
        datasets: (Object.entries(groupedResults) as [string, ChainVolumeData[]][]).map(([chainId, data]) => ({
          chainId: parseInt(chainId),
          chainName: data[0].chainName,
          data: data.map((item: ChainVolumeData) => ({
            date: item.date,
            volume: item.volume
          })),
          priceUsd: 1 // TODO: Get actual price from price table
        }))
      }

      res.json(response)
    } catch (error) {
      console.error('Error getting cumulative volume by chain stats:', error)
      res.status(500).json({ error: 'Failed to get cumulative volume by chain stats' })
    }
  }
}

export { Controller } 
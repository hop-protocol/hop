import TransferStats from './TransferStats'
import { OsStats } from './OsStats'
import wait from 'wait'

type Options = {
  days?: number
  offsetDays?: number
  transfers?: boolean
}

class Worker {
  transferStats: TransferStats
  osStats: OsStats
  pollIntervalMs: number = 60 * 60 * 1000

  constructor (options: Options = {}) {
    const {
      days,
      offsetDays,
      transfers
    } = options
    if (transfers) {
      this.transferStats = new TransferStats({ days, offsetDays })
    }

    this.osStats = new OsStats()
  }

  async start () {
    console.log('worker started')
    console.log(`polling every ${this.pollIntervalMs}ms`)
    const promises: Promise<any>[] = []
    if (this.transferStats) {
      promises.push(this.transferStatsPoll())
    }
    if (this.osStats) {
      promises.push(this.osStats.start())
    }
    if (!promises.length) {
      throw new Error('at least one option is required')
    }
    await Promise.all(promises)
  }

  async transferStatsPoll () {
    console.log('transferStatsPoll started')
    while (true) {
      try {
        console.log('poll')
        console.log('fetching transfer stats')
        await this.transferStats.trackTransfers()
        console.log('done tracking transfers stats')
      } catch (err) {
        console.error('poll error:', err)
      }
      console.log('poll complete')
      await wait(this.pollIntervalMs)
    }
  }
}

export default Worker

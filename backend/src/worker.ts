import TransferStats from './TransferStats'
import wait from 'wait'

type Options = {
  days?: number
  transfers?: boolean
}

class Worker {
  transferStats: TransferStats
  pollIntervalMs: number = 60 * 60 * 1000

  constructor (options: Options = {}) {
    const {
      days,
      transfers
    } = options
    if (transfers) {
      this.transferStats = new TransferStats({ days })
    }
  }

  async start () {
    console.log('worker started')
    console.log(`polling every ${this.pollIntervalMs}ms`)
    const promises: Promise<any>[] = []
    if (this.transferStats) {
      promises.push(this.transferStatsPoll())
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
        console.log('fetching volume stats')
        await this.transferStats.trackTransfers()
        console.log('done tracking transfers stats')
      } catch (err) {
        console.error(err)
      }
      await wait(this.pollIntervalMs)
    }
  }
}

export default Worker

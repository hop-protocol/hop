import Logger from 'src/logger'
import os from 'os'
import pidusage from 'pidusage'
import wait from 'src/utils/wait'

class OsWatcher {
  pollIntervalMs: number = 60 * 1000
  logger: Logger

  constructor () {
    this.logger = new Logger({
      tag: 'OsWatcher'
    })
  }

  start () {
    this.poll()
  }

  async poll () {
    while (true) {
      try {
        await this.logUsage()
      } catch (err) {
        this.logger.error(`error retrieving stats: ${err.message}`)
      }
      await wait(this.pollIntervalMs)
    }
  }

  logUsage () {
    return new Promise((resolve, reject) => {
      pidusage(process.pid, (err: Error, stats: any) => {
        if (err) {
          reject(err)
          return
        }
        if (!stats) {
          reject(new Error('expected stats'))
          return
        }
        const vcpus = os?.cpus()?.length
        const cpuPercent = stats?.cpu
        const cpuFormatted = `${cpuPercent?.toFixed(2)}% out of 100*vcpus (${vcpus})`
        const totalMemoryMb = os?.totalmem() / 1024 / 1024
        const memoryUsageMb = stats?.memory / 1024 / 1024
        const memoryPercent = (memoryUsageMb / totalMemoryMb) * 100
        const memoryFormatted = `${memoryUsageMb?.toFixed(2)}MB out of ${totalMemoryMb?.toFixed(2)}MB (${memoryPercent?.toFixed(2)}%)`
        this.logger.debug(`CPU: ${cpuFormatted}`)
        this.logger.debug(`MEMORY: ${memoryFormatted}`)
        resolve(null)
      })
    })
  }
}

export default OsWatcher

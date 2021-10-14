import Logger from 'src/logger'
import checkDiskSpace from 'check-disk-space'
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
        await this.logCpuMemory()
        await this.logDisk()
      } catch (err) {
        this.logger.error(`error retrieving stats: ${err.message}`)
      }
      await wait(this.pollIntervalMs)
    }
  }

  async logDisk () {
    return await new Promise((resolve) => {
      checkDiskSpace('/').then((diskSpace) => {
        const freeSizeGb = diskSpace?.free / 1024 / 1024 / 1024
        const totalSizeGb = diskSpace?.size / 1024 / 1024 / 1024
        const usedSizeGb = totalSizeGb - freeSizeGb
        const usedSizeFormatted = `${usedSizeGb?.toFixed(2)}GB`
        const totalSizeFormatted = `${totalSizeGb?.toFixed(2)}GB`
        const usedPercent = (usedSizeGb / totalSizeGb) * 100
        const usedPercentFormatted = `${usedPercent?.toFixed(2)}%`
        this.logger.debug(`DISK: ${usedSizeFormatted}/${totalSizeFormatted} (${usedPercentFormatted})`)
        resolve(null)
      })
    })
  }

  async logCpuMemory () {
    return await new Promise((resolve, reject) => {
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

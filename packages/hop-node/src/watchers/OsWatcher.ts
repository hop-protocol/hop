import Logger from 'src/logger'
import Metrics from 'src/watchers/classes/Metrics'
import checkDiskSpace from 'check-disk-space'
import os from 'os'
import pidusage from 'pidusage'
import wait from 'src/utils/wait'

class OsWatcher {
  pollIntervalMs: number = 60 * 1000
  logger: Logger
  metrics = new Metrics()

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

  logDisk () {
    return new Promise((resolve) => {
      checkDiskSpace('/').then((diskSpace) => {
        const totalSize = diskSpace?.size
        const freeSize = diskSpace?.free
        const freeSizeGb = freeSize / 1024 / 1024 / 1024
        const totalSizeGb = totalSize / 1024 / 1024 / 1024
        const usedSize = totalSize - freeSize
        const usedSizeGb = usedSize / 1024 / 1024 / 1024
        const usedSizeFormatted = `${usedSizeGb?.toFixed(2)}GB`
        const totalSizeFormatted = `${totalSizeGb?.toFixed(2)}GB`
        const usedPercent = (usedSizeGb / totalSizeGb) * 100
        const usedPercentFormatted = `${usedPercent?.toFixed(2)}%`
        this.logger.debug(`DISK: ${usedSizeFormatted}/${totalSizeFormatted} (${usedPercentFormatted})`)
        this.metrics.setDisk(totalSize, freeSize, usedSize)
        resolve(null)
      })
    })
  }

  logCpuMemory () {
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
        const totalMemory = os?.totalmem()
        const totalMemoryMb = totalMemory / 1024 / 1024
        const usedMemory = stats?.memory
        const usedMemoryMb = usedMemory / 1024 / 1024
        const freeMemory = totalMemory - usedMemory
        const memoryPercent = (usedMemoryMb / totalMemoryMb) * 100
        const memoryFormatted = `${usedMemoryMb?.toFixed(2)}MB out of ${totalMemoryMb?.toFixed(2)}MB (${memoryPercent?.toFixed(2)}%)`
        this.logger.debug(`CPU: ${cpuFormatted}`)
        this.logger.debug(`MEMORY: ${memoryFormatted}`)
        this.metrics.setMemory(totalMemory, freeMemory, usedMemory)
        resolve(null)
      })
    })
  }
}

export default OsWatcher

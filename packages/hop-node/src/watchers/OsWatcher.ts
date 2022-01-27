import Logger from 'src/logger'
import Metrics from 'src/watchers/classes/Metrics'
import checkDiskSpace from 'check-disk-space'
import heapdump from 'heapdump'
import os from 'os'
import pidusage from 'pidusage'
import wait from 'src/utils/wait'

type Config = {
  heapdump: boolean
}

class OsWatcher {
  statsPollIntervalMs: number = 60 * 1000
  heapdumpPollIntervalMs: number = 5 * 60 * 1000
  heapdump: boolean = false
  heapIndex: number = 0
  logger: Logger
  metrics = new Metrics()

  constructor (config: Partial<Config> = {}) {
    this.logger = new Logger({
      tag: this.constructor.name
    })
    if (config.heapdump) {
      this.heapdump = true
    }
  }

  start () {
    this.poll()
  }

  async poll () {
    await Promise.all([
      this.pollStats(),
      this.pollHeapdump()
    ])
  }

  async pollStats () {
    while (true) {
      try {
        await this.logCpuMemory()
        await this.logDisk()
      } catch (err) {
        this.logger.error(`error retrieving stats: ${err.message}`)
      }
      await wait(this.statsPollIntervalMs)
    }
  }

  async pollHeapdump () {
    if (!this.heapdump) {
      return
    }
    while (true) {
      try {
        await this.logHeapdump()
      } catch (err) {
        this.logger.error(`error heapdumping: ${err.message}`)
      }
      await wait(this.heapdumpPollIntervalMs)
    }
  }

  async logDisk () {
    return await new Promise((resolve) => {
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
        const usedPercentFormatted = `${usedPercent.toFixed(2)}%`
        this.logger.info(`DISK: ${usedSizeFormatted}/${totalSizeFormatted} (${usedPercentFormatted})`)
        this.metrics.setDisk(totalSize, freeSize, usedSize)
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
        const vcpus = os.cpus().length
        const cpuPercent = stats?.cpu
        const cpuFormatted = `${cpuPercent?.toFixed(2)}% out of 100*vcpus (${vcpus})`
        const totalMemory = os?.totalmem()
        const totalMemoryMb = totalMemory / 1024 / 1024
        const usedMemory = stats?.memory
        const usedMemoryMb = usedMemory / 1024 / 1024
        const freeMemory = totalMemory - usedMemory
        const memoryPercent = (usedMemoryMb / totalMemoryMb) * 100
        const memoryFormatted = `${usedMemoryMb?.toFixed(2)}MB out of ${totalMemoryMb?.toFixed(2)}MB (${memoryPercent?.toFixed(2)}%)`
        this.logger.info(`CPU: ${cpuFormatted}`)
        this.logger.info(`MEMORY: ${memoryFormatted}`)
        this.metrics.setMemory(totalMemory, freeMemory, usedMemory)
        resolve(null)
      })
    })
  }

  async logHeapdump () {
    this.heapIndex++
    const location = `/tmp/heapdump_${Date.now()}.heapsnapshot`
    this.logger.debug('generating heapdump snapshot')
    // note: if you see the error "Segmentation fault (core dumped)" on node v14,
    // try using node v12
    heapdump.writeSnapshot(location)
    this.logger.info(`wrote heapdump snapshot to: ${location}`)
  }
}

export default OsWatcher

import os from 'os'
import pidusage from 'pidusage'
import wait from 'wait'

export class OsStats {
  statsPollIntervalMs: number = 60 * 1000

  async start () {
    await this.poll()
  }

  async poll () {
    while (true) {
      try {
        await this.logCpuMemory()
      } catch (err) {
        console.error(`error retrieving stats: ${err.message}`)
      }
      await wait(this.statsPollIntervalMs)
    }
  }

  async getCpuMemoryUsage (): Promise<any> {
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
        const vcores = os.cpus().length
        const cpuPercent = (stats?.cpu / (100 * vcores)) * 100
        const cpuFormatted = `${cpuPercent?.toFixed(2)}% out of 100 (${stats?.cpu}% out of 100 * ${vcores} vcore)`
        const totalMemory = os?.totalmem()
        const totalMemoryMb = totalMemory / 1024 / 1024
        const usedMemory = stats?.memory
        const usedMemoryMb = usedMemory / 1024 / 1024
        const freeMemory = totalMemory - usedMemory
        const memoryPercent = (usedMemoryMb / totalMemoryMb) * 100
        const memoryFormatted = `${usedMemoryMb?.toFixed(2)}MB out of ${totalMemoryMb?.toFixed(2)}MB (${memoryPercent?.toFixed(2)}%)`

        resolve({
          vcores,
          cpuPercent,
          cpuFormatted,
          totalMemory,
          totalMemoryMb,
          usedMemory,
          usedMemoryMb,
          freeMemory,
          memoryPercent,
          memoryFormatted
        })
      })
    })
  }

  async logCpuMemory () {
    const { cpuFormatted, memoryFormatted } = await this.getCpuMemoryUsage()
    console.log(`CPU: ${cpuFormatted}`)
    console.log(`MEMORY: ${memoryFormatted}`)
  }
}

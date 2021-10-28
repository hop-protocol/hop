import { metrics } from 'src/metrics'
import { config as globalConfig } from 'src/config'

class Metrics {
  metrics = metrics
  enabled: boolean = globalConfig?.metrics?.enabled

  setBonderBalance (chain: string, token: string, balance: number) {
    if (!this.enabled) {
      return
    }
    this.metrics?.bonderBalance.set({ chain, token }, balance)
  }

  setDisk (totalSize: number, freeSize: number, usedSize: number) {
    if (!this.enabled) {
      return
    }
    this.metrics?.totalDisk.set({}, totalSize)
    this.metrics?.freeDisk.set({}, freeSize)
    this.metrics?.usedDisk.set({}, usedSize)
  }

  setMemory (totalMemory: number, freeMemory: number, usedMemory: number) {
    if (!this.enabled) {
      return
    }
    this.metrics?.totalMemory.set({}, totalMemory)
    this.metrics?.freeMemory.set({}, freeMemory)
    this.metrics?.usedMemory.set({}, usedMemory)
  }
}

export default Metrics

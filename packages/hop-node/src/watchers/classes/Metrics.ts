// import { metrics } from 'src/metrics'

class Metrics {
  // metrics = metrics

  setBonderBalance (chain: string, token: string, balance: number) {
    // this.metrics?.bonderBalance.set({ chain, token }, balance)
  }

  setDisk (totalSize: number, freeSize: number, usedSize: number) {
    // this.metrics?.totalDisk.set({}, totalSize)
    // this.metrics?.freeDisk.set({}, freeSize)
    // this.metrics?.usedDisk.set({}, usedSize)
  }

  setMemory (totalMemory: number, freeMemory: number, usedMemory: number) {
    // this.metrics?.totalMemory.set({}, totalMemory)
    // this.metrics?.freeMemory.set({}, freeMemory)
    // this.metrics?.usedMemory.set({}, usedMemory)
  }
}

export default Metrics

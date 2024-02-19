import { config as globalConfig } from 'src/config'
import { hostname } from '@hop-protocol/hop-node-core/src/config'
import { metrics } from '@hop-protocol/hop-node-core/src/metrics'

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

  setRpcProviderMethod (url: string, method: string, params: any) {
    if (!this.enabled) {
      return
    }
    let value = ''
    if (typeof params === 'object') {
      value = JSON.stringify(params)
    } else if (typeof params === 'string') {
      value = params
    } else if (typeof params === 'number') {
      value = params.toString()
    }
    this.metrics?.rpcProviderMethod.inc({ instance_hostname: hostname, url, method, params: value })
  }
}

export default Metrics

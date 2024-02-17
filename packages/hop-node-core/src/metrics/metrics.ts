import { Counter, Gauge } from 'prom-client'

export const metrics = {
  bonderBalance: new Gauge({
    name: 'bonder_balance',
    help: 'Balance of the bonder for a particular token and chain',
    labelNames: ['token', 'chain'] as const
  }),
  totalDisk: new Gauge({
    name: 'total_disk',
    help: 'Total disk size'
  }),
  freeDisk: new Gauge({
    name: 'free_disk',
    help: 'Free disk size'
  }),
  usedDisk: new Gauge({
    name: 'used_disk',
    help: 'Used disk size'
  }),
  totalMemory: new Gauge({
    name: 'total_memory',
    help: 'Total memory'
  }),
  freeMemory: new Gauge({
    name: 'free_memory',
    help: 'Free memory'
  }),
  usedMemory: new Gauge({
    name: 'used_memory',
    help: 'Used memory'
  }),
  rpcProviderMethod: new Counter({
    name: 'rpc_provider_method',
    help: 'RPC provider method call',
    labelNames: ['url', 'method', 'params', 'instance_hostname']
  })
}

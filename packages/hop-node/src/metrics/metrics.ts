import { Gauge } from 'prom-client'

export const metrics = {
  bonderBalance: new Gauge({
    name: 'bonder_balance',
    help: 'Balance of the bonder for a particular token and chain',
    labelNames: ['token', 'chain'] as const
  })
}

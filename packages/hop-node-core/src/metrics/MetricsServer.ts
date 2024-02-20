import { Logger } from '#src/logger/index.js'
import express, { Express } from 'express'
import { Metric, Registry, collectDefaultMetrics } from 'prom-client'
import { metrics } from './metrics.js'

export class MetricsServer {
  private readonly app: Express
  private readonly registry: Registry
  private readonly logger: Logger

  constructor (private readonly port = 8080) {
    this.logger = new Logger('Metrics')
    this.registry = new Registry()
    MetricsServer._registerCustomMetrics(this.registry)
    this.app = express()
    this.#init()
      .then(() => {
        console.log('metrics server initialized')
      })
      .catch((err: Error) => {
        console.error('metrics server initialization error:', err)
        process.exit(1)
      })
  }

  async #init (): Promise<void> {
    const metrics = await this.registry.metrics()
    this.app.get('/metrics', (req, resp) => {
      resp.setHeader('Content-Type', this.registry.contentType)
      resp.send(metrics)
    })
  }

  async start () {
    collectDefaultMetrics({
      register: this.registry,
      gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5]
    })
    this.app.listen(this.port, () => {
      this.logger.info(`metrics server listening on port ${this.port} at /metrics`)
    })
  }

  private static _registerCustomMetrics (registry: Registry): void {
    for (const metric of Object.values(metrics)) {
      registry.registerMetric(metric as Metric<"url" | "method" | "params" | "instance_hostname">)
    }
  }
}

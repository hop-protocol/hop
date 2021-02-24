import Logger from 'src/logger'

interface Config {
  label: string
  logColor: string
  order?: () => number
}

class BaseWatcher {
  logger: Logger
  label: string
  order: () => number = () => 0
  started: boolean = false

  constructor (config: Config) {
    this.label = config.label
    this.logger = new Logger(`[${this.label}]`, { color: config.logColor })
    if (config.order) {
      this.order = config.order
    }
  }

  async start () {
    this.logger.warn('not implemented: implement in child class')
  }

  async stop () {
    this.logger.warn('not implemented: implement in child class')
  }
}

export default BaseWatcher

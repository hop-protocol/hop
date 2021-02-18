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

  constructor (config: Config) {
    this.label = config.label
    this.logger = new Logger(`[${this.label}]`, { color: config.logColor })
    if (config.order) {
      this.order = config.order
    }
  }

  start () {
    this.logger.warn('not implemented: implement in child class')
  }
}

export default BaseWatcher

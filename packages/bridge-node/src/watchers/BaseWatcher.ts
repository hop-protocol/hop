import Logger from 'src/logger'

interface Config {
  label: string
  logColor: string
}

class BaseWatcher {
  logger: Logger
  label: string

  constructor (config: Config) {
    this.label = config.label
    this.logger = new Logger(`[${this.label}]`, { color: config.logColor })
  }

  start () {
    this.logger.warn('not implemented: implement in child class')
  }
}

export default BaseWatcher

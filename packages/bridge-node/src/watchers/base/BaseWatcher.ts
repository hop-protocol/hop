import { EventEmitter } from 'events'
import Logger from 'src/logger'

interface Config {
  tag: string
  prefix?: string
  logColor?: string
  order?: () => number
}

class BaseWatcher extends EventEmitter {
  logger: Logger
  order: () => number = () => 0
  started: boolean = false

  constructor (config: Config) {
    super()
    const { tag, prefix, order, logColor } = config
    this.logger = new Logger({
      tag,
      prefix,
      color: logColor
    })
    if (order) {
      this.order = order
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

import { formatError } from 'src/utils'

class Logger {
  private prefix: string

  constructor(prefix: string = '') {
    this.prefix = prefix
  }

  critical = (...input: any[]) => {
    console.error(this.prefix, ...input)
  }

  debug = (...input: any[]) => {
    console.debug(this.prefix, ...input)
  }

  error = (...input: any[]) => {
    console.error(this.prefix, ...input)
  }

  info = (...input: any[]) => {
    console.info(this.prefix, ...input)
  }

  log = (...input: any[]) => {
    console.log(this.prefix, ...input)
  }

  warn = (...input: any[]) => {
    console.warn(this.prefix, ...input)
  }
}

const logger = new Logger('hop:')

export function logError(error: any) {
  logger.error(formatError(new Error(error.message)))
}

export default logger

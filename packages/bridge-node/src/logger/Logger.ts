import chalk from 'chalk'

export interface Options {
  color: string
}

class Logger {
  private prefix: string

  constructor (
    prefix: string = '',
    opts: Partial<Options> = {
      color: 'white'
    }
  ) {
    this.prefix = chalk[opts.color](prefix)
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

export default Logger

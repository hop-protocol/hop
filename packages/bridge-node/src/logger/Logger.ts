import chalk from 'chalk'

export interface Options {
  color: string
}

class Logger {
  private prefix: string
  enabled: boolean = true

  constructor (
    prefix: string = '',
    opts: Partial<Options> = {
      color: 'white'
    }
  ) {
    this.prefix = chalk[opts.color](prefix)
    if (process.env.DISABLE_LOGS) {
      this.enabled = false
    }
  }

  critical = (...input: any[]) => {
    if (!this.enabled) return
    console.error(this.prefix, ...input)
  }

  debug = (...input: any[]) => {
    if (!this.enabled) return
    console.debug(this.prefix, ...input)
  }

  error = (...input: any[]) => {
    if (!this.enabled) return
    console.error(this.prefix, ...input)
  }

  info = (...input: any[]) => {
    if (!this.enabled) return
    console.info(this.prefix, ...input)
  }

  log = (...input: any[]) => {
    if (!this.enabled) return
    console.log(this.prefix, ...input)
  }

  warn = (...input: any[]) => {
    if (!this.enabled) return
    console.warn(this.prefix, ...input)
  }
}

export default Logger

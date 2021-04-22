import chalk from 'chalk'

export interface Options {
  tag?: string
  prefix?: string
  color: string
}

export enum LogLevels {
  Error,
  Warn,
  Info,
  Debug
}

let logLevel = LogLevels.Debug
export const setLogLevel = (_logLevel: LogLevels | string) => {
  if (typeof _logLevel === 'string') {
    const mapping: { [key: string]: number } = {
      error: LogLevels.Error,
      warn: LogLevels.Warn,
      info: LogLevels.Info,
      debug: LogLevels.Debug
    }
    _logLevel = mapping[_logLevel]
  }
  logLevel = _logLevel
}

class Logger {
  private tag: string = ''
  private prefix: string = ''
  enabled: boolean = true

  setEnabled (enabled: boolean) {
    this.enabled = enabled
  }

  constructor (
    tag: Partial<Options> | string = '',
    opts: Partial<Options> = {
      color: 'white'
    }
  ) {
    if (tag instanceof Object) {
      opts = tag
      tag = opts.tag
    }
    if (opts.prefix) {
      this.prefix = `<${opts.prefix}>`
    }
    if (tag) {
      this.tag = (chalk as any)[opts.color](`[${tag}]`)
    }
    if (process.env.DISABLE_LOGGER) {
      this.enabled = false
    }
  }

  critical = (...input: any[]) => {
    if (!this.enabled) return
    console.error(this.tag, ...input)
  }

  debug = (...input: any[]) => {
    if (!this.enabled) return
    if (logLevel !== LogLevels.Debug) {
      return
    }
    console.debug(this.tag, this.prefix, ...input)
  }

  error = (...input: any[]) => {
    if (!this.enabled) return
    console.error(this.tag, this.prefix, ...input)
  }

  info = (...input: any[]) => {
    if (!this.enabled) return
    if (!(logLevel === LogLevels.Debug || logLevel === LogLevels.Info)) {
      return
    }
    console.info(this.tag, this.prefix, ...input)
  }

  log = (...input: any[]) => {
    if (!this.enabled) return
    if (logLevel < LogLevels.Info) {
      return
    }
    console.log(this.tag, this.prefix, ...input)
  }

  warn = (...input: any[]) => {
    if (!this.enabled) return
    if (logLevel < LogLevels.Warn) {
      return
    }
    console.warn(this.tag, this.prefix, ...input)
  }
}

export default Logger

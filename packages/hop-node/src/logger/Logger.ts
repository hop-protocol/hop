import chalk from 'chalk'
import { DateTime } from 'luxon'

export interface Options {
  tag?: string
  prefix?: string
  color: string
}

interface AdditionalDataLabel {
  id?: string
  root?: string
}

export enum LogLevels {
  Critical,
  Error,
  Warn,
  Info,
  Log,
  Debug
}

const logLevelColors: { [key: string]: string } = {
  [LogLevels.Critical]: 'red',
  [LogLevels.Error]: 'red',
  [LogLevels.Warn]: 'yellow',
  [LogLevels.Info]: 'blue',
  [LogLevels.Log]: 'white',
  [LogLevels.Debug]: 'white'
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
  private options: any = {}
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
      if (opts.color) {
        this.tag = chalk[opts.color](`[${tag}]`)
      } else {
        this.tag = `[${tag}]`
      }
    }
    if (process.env.DISABLE_LOGGER) {
      this.enabled = false
    }
    this.options = opts
  }

  create (additionalDataLabel: AdditionalDataLabel): Logger {
    let label: string
    if (additionalDataLabel?.id) {
      label = `id: ${additionalDataLabel.id}`
    } else {
      label = `root: ${additionalDataLabel.root}`
    }

    return new Logger(
      this.options.tag,
      Object.assign({}, this.options, {
        prefix: `${this.options.prefix ? `${this.options.prefix} ` : ''}${label}`
      })
    )
  }

  get timestamp (): string {
    return DateTime.now().toISO()
  }

  headers (logLevelEnum: LogLevels): string[] {
    const keys = Object.keys(LogLevels)
    const logLevelName = keys[logLevelEnum + keys.length / 2].toUpperCase()
    const coloredLogLevel = chalk[logLevelColors[logLevelEnum]](
      logLevelName.padEnd(5, ' ')
    )
    return [this.timestamp, coloredLogLevel, this.tag, this.prefix]
  }

  critical = (...input: any[]) => {
    if (!this.enabled) return
    console.error(...this.headers(LogLevels.Critical), ...input)
  }

  debug = (...input: any[]) => {
    if (!this.enabled) return
    if (logLevel !== LogLevels.Debug) {
      return
    }
    console.debug(...this.headers(LogLevels.Debug), ...input)
  }

  error = (...input: any[]) => {
    if (!this.enabled) return
    console.error(...this.headers(LogLevels.Error), ...input)
  }

  info = (...input: any[]) => {
    if (!this.enabled) return
    if (!(logLevel === LogLevels.Debug || logLevel === LogLevels.Info)) {
      return
    }
    console.info(...this.headers(LogLevels.Info), ...input)
  }

  log = (...input: any[]) => {
    if (!this.enabled) return
    if (logLevel < LogLevels.Info) {
      return
    }
    console.log(...this.headers(LogLevels.Log), ...input)
  }

  warn = (...input: any[]) => {
    if (!this.enabled) return
    if (logLevel < LogLevels.Warn) {
      return
    }
    console.warn(...this.headers(LogLevels.Warn), ...input)
  }
}

export default Logger

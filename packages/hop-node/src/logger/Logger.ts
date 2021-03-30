import chalk from 'chalk'

export interface Options {
  tag?: string
  prefix?: string
  color: string
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
    console.debug(this.tag, this.prefix, ...input)
  }

  error = (...input: any[]) => {
    if (!this.enabled) return
    console.error(this.tag, this.prefix, ...input)
  }

  info = (...input: any[]) => {
    if (!this.enabled) return
    console.info(this.tag, this.prefix, ...input)
  }

  log = (...input: any[]) => {
    if (!this.enabled) return
    console.log(this.tag, this.prefix, ...input)
  }

  warn = (...input: any[]) => {
    if (!this.enabled) return
    console.warn(this.tag, this.prefix, ...input)
  }
}

export default Logger

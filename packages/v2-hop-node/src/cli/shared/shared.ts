import fs from 'node:fs'
import path from 'node:path'
import { Command } from 'commander'
import { Logger } from '#logger/index.js'
import { initConfigs } from '#config/index.js'

export const logger = new Logger('config')
export const program = new Command()

export const root = program
  .option(
    '--config <path>',
    'Config file path to use. Config file must be in JSON format',
    parseString
  )
  .option('--env <path>', 'Environment variables file', parseString)

export function actionHandler (fn: (source: any) => any) {
  return async (source: any = {}) => {
    try {
      await initConfigs()
      await fn(source)
      process.exit(0)
    } catch (err) {
      logger.error(`program error: ${err.message}\ntrace: ${err.stack}`)
      process.exit(1)
    }
  }
}

export function parseNumber (value: string) {
  return Number(value)
}

export function parseString (value: string) {
  return value
}

export function parseStringArray (value: string) {
  return value.trim().split(',').map((v: string) => v.trim())
}

export function parseBool (value: string) {
  return value !== 'false'
}

export function parseInputFileList (value: string) {
  if (value) {
    const data = fs.readFileSync(path.resolve(value), 'utf8')
    if (value.endsWith('.json')) {
      try {
        const parsed = JSON.parse(data)
        if (Array.isArray(parsed)) {
          return parsed
        }
        throw new Error('Data must be an Array')
      } catch (err) {
        throw new Error(`Invalid json file. Error: ${err.message}`)
      }
    }

    const list = data.split('\n').map(x => x.trim()).filter((x: any) => x)
    return list
  }
  return null
}

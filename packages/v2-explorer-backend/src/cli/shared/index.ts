import '../../utils/loadEnvFile'
import fs from 'fs'
import path from 'path'
import { Command } from 'commander'

export const program = new Command()

export const root = program
  .option('--env <path>', 'Environment variables file', parseString)

export function actionHandler (fn: Function) {
  return async (source: any = {}) => {
    try {
      if (!source.skipMain) {
        await fn(source)
        process.exit(0)
      }
    } catch (err) {
      console.error(`program error: ${err.message}\ntrace: ${err.stack}`)
      process.exit(1)
    }
  }
}

export function parseNumber (value: string) {
  return Number(value)
}

export function parseString (value: string) {
  return value ?? ''
}

export function parseStringArray (value: string) {
  return (value ?? '').trim().split(',').map((v: string) => v.trim())
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

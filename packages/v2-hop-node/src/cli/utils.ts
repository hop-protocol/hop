import fs from 'node:fs'
import path from 'node:path'
import { Command } from 'commander'
import { Logger } from '#logger/index.js'
import { type ICLIConfig, initConfigs } from '#config/index.js'

export const program = new Command()
export const root = program
  .option('--config <path>', 'Config file path', parseString)
  .option('--dry-run [boolean]', 'Perform a dry run', parseBool)

export async function initCLI (source: any): Promise<void> {
  const cliConfig = getCLIConfig(source)
  await initConfigs(cliConfig)
}

export function actionHandler (fn: (source: any) => any) {
  const logger = new Logger('CLI - actionHandler')
  return async (source: any = {}) => {
    try {
      // const cliConfig = getCLIConfig(source)
      // await initConfigs(cliConfig)
      await fn(source)
      process.exit(0)
    } catch (err) {
      logger.error(`program error: ${err.message}\ntrace: ${err.stack}`)
      process.exit(1)
    }
  }
}

function getCLIConfig (source: any): ICLIConfig {
  const logger = new Logger('CLI - getCLIConfig')
  const customConfigPath = source?.config ?? ''
  if (customConfigPath) {
    logger.debug(`Using custom config path: ${customConfigPath}`)
  }
  const dryRun = source?.dryRun ?? false
  if (dryRun) {
    logger.debug('Running in dry-run')
  }
  return {
    customConfigPath,
    dryRun
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

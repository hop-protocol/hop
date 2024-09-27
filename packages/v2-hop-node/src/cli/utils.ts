import fs from 'node:fs'
import path from 'node:path'
import { Logger } from '#logger/index.js'
import { type ICLIConfig, initConfigs } from '#config/index.js'

/**
 * Initiation
 */

export async function initCLI (source: any): Promise<void> {
  const cliConfig = getCLIConfig(source)
  await initConfigs(cliConfig)
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

/**
 * Parsing
 */

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

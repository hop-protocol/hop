import path from 'node:path'
import os from 'node:os'
import fs from 'node:fs'
import type { IConfig } from './types.js'
import { USER_CONFIG_PATH } from './constants.js'

export async function parseUserDefinedConfigFile (): Promise<IConfig> {
  const configPath = path.resolve(USER_CONFIG_PATH.replace('~', os.homedir()))
  return parseConfigFile(configPath)
}

async function parseConfigFile (configPath: string): Promise<IConfig> {
  if (!configPath) {
    throw new Error('config file path is required')
  }

  if (!fs.existsSync(configPath)) {
    throw new Error(`no config file found at ${configPath}`)
  }

  const { default: config } = await import(configPath, {
    with: { type: "json" }
  })

  if (config == null) {
    throw new Error('config file not found')
  }

  return config
}

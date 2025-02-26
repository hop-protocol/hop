import fs from 'node:fs'
import { NetworkSlug } from '@hop-protocol/sdk'
import { validateRequiredKeys } from '../../utils.js'

export interface IGlobalOptionsConfig {
  dryRun: boolean
  dbDir: string
  network: NetworkSlug
}

export async function validate(config: Partial<IGlobalOptionsConfig>): Promise<void> {
  const requiredKeys: Array<keyof IGlobalOptionsConfig> = ['dryRun', 'dbDir', 'network']
  validateRequiredKeys<IGlobalOptionsConfig>(config, requiredKeys)

  const { dbDir, network } = config

  if (!fs.existsSync(dbDir)) {
    throw new Error(`Invalid or missing dbDir: ${dbDir}`)
  }


  if (!Object.values(NetworkSlug).includes(network)) {
    throw new Error(`Invalid network value: ${network}`)
  }
}

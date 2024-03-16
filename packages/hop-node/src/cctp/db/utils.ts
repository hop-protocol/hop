import os from 'node:os'
import path from 'node:path'
import { config as globalConfig } from 'src/config'
import { mkdirp } from 'mkdirp'

// Assume that a path is a location if it contains a slash
export function getDbPathForNameOrLocation (dbNameOrLocation: string): string {
  if (dbNameOrLocation.includes('/')) {
    return dbNameOrLocation
  }

  const basePath = globalConfig.db.path.replace('~', os.homedir() + '/')
  const pathWithName = basePath + '_' + dbNameOrLocation
  const pathname = path.resolve(pathWithName)
  mkdirp.sync(pathname.replace(path.basename(pathname), ''))
  return pathname
}

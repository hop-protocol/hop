import os from 'node:os'
import path from 'node:path'
import { config as globalConfig } from '#config/index.js'
import { mkdirp } from 'mkdirp'
import { BigNumber } from 'ethers'

// Assume that a path is a location if it contains a slash
export function getDBPath (dbNameOrLocation: string): string {
  const basePath = globalConfig.db.path.replace('~', os.homedir() + '/')
  const pathWithName = basePath + '_' + dbNameOrLocation
  const pathname = path.resolve(pathWithName)
  mkdirp.sync(pathname.replace(path.basename(pathname), ''))
  return pathname
}

export function normalizeDBValue<T extends Record<string, any>>(value: T): T {
  for (const prop in value) {
    const isBigNumber = value[prop]?.type === 'BigNumber'
    if (isBigNumber) {
      value = normalizeBigNumber(value, prop)
      continue
    } 

    const isNestedObject = typeof value[prop] === 'object' && value[prop] !== null
    if (isNestedObject) {
      value[prop] = normalizeDBValue(value[prop])
      continue
    }
  }

  return value
}

function normalizeBigNumber (value: any, prop: string): any {
  if (value?.[prop] && value?.[prop]?.type === 'BigNumber') {
    value[prop] = BigNumber.from(value[prop]?.hex)
  }

  return value
}

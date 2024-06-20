import os from 'node:os'
import path from 'node:path'
import { ChainSlug, NetworkSlug, getChain } from '@hop-protocol/sdk'
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


// TODO: Get these from more persistent config
export const DEFAULT_START_BLOCK_NUMBER: Record<string, Partial<Record<ChainSlug, number>>> = {
  [NetworkSlug.Mainnet]: {
    [ChainSlug.Ethereum]: 19786200, //19447854,
    [ChainSlug.Optimism]: 119550000, //117499078,
    [ChainSlug.Arbitrum]: 207240000, //190986712,
    [ChainSlug.Base]: 13956000, //11903793,
    [ChainSlug.Polygon]: 56513000, //54729294
  },
  [NetworkSlug.Sepolia]: {
    [ChainSlug.Ethereum]: 5498073,
    [ChainSlug.Optimism]: 9397181,
    [ChainSlug.Arbitrum]: 23788247,
    [ChainSlug.Base]: 7414306
  }
}

export function getDefaultStartBlockNumber (chainId: string): number {
  const chainSlug = getChain(chainId).slug
  return (DEFAULT_START_BLOCK_NUMBER as any)[globalConfig.network as NetworkSlug][chainSlug]
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

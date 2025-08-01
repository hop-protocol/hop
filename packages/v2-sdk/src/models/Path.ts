import { BigNumber } from 'ethers'
import { PathConfig } from '../config/paths/types.js'
import { Address } from './Address.js'
import { allPaths } from '../config/paths/index.js'
import { Chain, Chainish } from './Chain.js'

export type Pathish = Path | PathConfig | string

export class Path {
  readonly pathId: string
  readonly chain0: Chain
  readonly tokenAddress0: Address
  readonly chain1: Chain
  readonly tokenAddress1: Address
  readonly initialReserve: BigNumber

  constructor(config: PathConfig) {
    this.pathId = config.pathId
    this.chain0 = Chain.getChain(config.chainId0)
    this.tokenAddress0 = Address.getAddress(config.tokenAddress0)
    this.chain1 = Chain.getChain(config.chainId1)
    this.tokenAddress1 = Address.getAddress(config.tokenAddress1)
    this.initialReserve = config.initialReserve
  }

  static getPath(path: Pathish): Path {
    if (path instanceof Path) {
      return path
    }
    if (typeof path === 'string') {
      const pathConfig = allPaths[path]
      if (!pathConfig) {
        throw new Error(`Path with pathId "${path}" not found`)
      }
      return new Path(pathConfig)
    }
    return new Path(path)
  }

  static getPaths(): PathConfig[] {
    return Object.values(allPaths)
  }

  eq(otherPath: Pathish): boolean {
    return this.pathId === Path.getPath(otherPath).pathId
  }

  getCounterpartChain(chain: Chainish): Chain {
    const _chain = Chain.getChain(chain)
    if (_chain.chainId === this.chain0.chainId) {
      return this.chain1
    } else if (_chain.chainId === this.chain1.chainId) {
      return this.chain0
    }
    throw new Error(`Chain ${chain} is not in path ${this.pathId}`)
  }
}

export const getPath = Path.getPath
export const getPaths = Path.getPaths

import {
  type Pathish,
  type Chainish,
  getChain,
  getGateway,
  getPath
} from '#models/index.js'
import {
  type RailsGatewayContract,
  type RailsPathContract,
  getRailsGateway,
  getRailsPath
} from './contracts/index.js'
import { getRPC } from './utils.js'
import type { RPCish } from './types.js'

export abstract class RailsBase {
  readonly #gateways: Map<string, RailsGatewayContract> = new Map()
  readonly #paths: Map<string, Map<string, RailsPathContract>> = new Map()

  constructor(chains: Chainish[], rpcs: RPCish[]) {
    if (chains.length !== rpcs.length) {
      throw new Error('Chains and RPC clients must have the same length')
    }

    // TODO: Validate chainIds match RPC client chainIds. This is an async operation
    // so it might be better to do this in the constructor.

    for (let i = 0; i < chains.length; i++) {
      const chainId = getChain(chains[i]).chainId
      const rpc = getRPC(rpcs[i])

      if (this.#gateways.has(chainId)) {
        throw new Error(`Gateway for chain ${chainId} already exists`)
      }
      this.#gateways.set(chainId, getRailsGateway(chainId, rpc))

      const pathIds = getGateway(chainId).pathIds
      for (const pathId of pathIds) {
        if (!this.#paths.has(chainId)) {
          this.#paths.set(chainId, new Map())
        }
        this.#paths.get(chainId)!.set(pathId, getRailsPath(pathId, chainId, rpc))
      }
    }
  }

  protected getRailsGatewayContract(chain: Chainish): RailsGatewayContract {
    const chainId = getChain(chain).chainId
    const gateway = this.#gateways.get(chainId)
    if (!gateway) {
      throw new Error(`Gateway for chain ${chainId} not found`)
    }
    return gateway
  }

  protected getRailsPathContract(path: Pathish, chain: Chainish): RailsPathContract {
    const chainId = getChain(chain).chainId
    const pathId = getPath(path).pathId
    const pathContract = this.#paths.get(chainId)?.get(pathId)
    if (!pathContract) {
      throw new Error(`Path contract for path ${pathId} on chain ${chainId} not found`)
    }
    return pathContract
  }

  // TODO: More native way to do this
  protected requireTwoChains(): void {
    if (this.#gateways.size < 2) {
      throw new Error('Rails instance requires at least two chains')
    }
  }
}
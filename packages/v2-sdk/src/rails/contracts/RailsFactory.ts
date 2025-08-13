import type { RPC } from '../types.js'
import { RailsGateway } from './RailsGateway.js'
import { RailsPath } from './RailsPath.js'
import {
  type Chainish,
  type Pathish,
  getChain,
  getGateway,
  getPath
} from '#models/index.js'

export function getRailsGateway(chain: Chainish, rpc?: RPC): RailsGateway {
  const chainId = getChain(chain).chainId
  const address = getGateway(chainId).railsGateway
  return new RailsGateway(address, rpc)
}

export function getRailsPath(path: Pathish, chain: Chainish, rpc?: RPC): RailsPath {
  const chainId = getChain(chain).chainId
  const pathId = getPath(path).pathId
  const gateway = getGateway(chainId)
  const pathAddress = gateway.getPathContractAddress(pathId)
  return new RailsPath(pathAddress, rpc)
}

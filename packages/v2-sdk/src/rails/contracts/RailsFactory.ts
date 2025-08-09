import type { RPC } from '../types.js'
import { RailsGateway } from './RailsGateway.js'
import { RailsPath } from './RailsPath.js'
import { getGateway} from '#models/index.js'

export function getRailsGateway(chainId: string, rpc: RPC): RailsGateway {
  const address = getGateway(chainId).railsGateway
  return new RailsGateway(address, rpc)
}

export function getRailsPath(address: string, rpc: RPC): RailsPath {
  return new RailsPath(address, rpc)
}

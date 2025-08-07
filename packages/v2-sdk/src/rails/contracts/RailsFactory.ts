import type { RPCClient } from '../types.js'
import { RailsGateway } from './RailsGateway.js'
import { RailsPath } from './RailsPath.js'
import {
  type Addressish,
  type Chainish,
  getAddress,
  getChain,
  getGateway,
} from '#models/index.js'

export function getRailsGateway(chainId: Chainish, rpcClient: RPCClient): RailsGateway {
  const address = getGateway(getChain(chainId).chainId).railsGateway
  return new RailsGateway(address, rpcClient)
}

export function getRailsPath(address: Addressish, rpcClient: RPCClient): RailsPath {
  return new RailsPath(getAddress(address).toString(), rpcClient)
}

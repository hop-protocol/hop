import type { RPCish } from '../types.js'
import { RailsGateway } from './RailsGateway.js'
import { RailsPath } from './RailsPath.js'
import {
  type Addressish,
  type Chainish,
  getAddress,
  getChain,
  getGateway,
} from '#models/index.js'
import { getRPC } from '../utils.js'

export function getRailsGateway(chainId: Chainish, rpc: RPCish): RailsGateway {
  const address = getGateway(getChain(chainId).chainId).railsGateway
  return new RailsGateway(address, getRPC(rpc))
}

export function getRailsPath(address: Addressish, rpc: RPCish): RailsPath {
  return new RailsPath(getAddress(address).toString(), getRPC(rpc))
}

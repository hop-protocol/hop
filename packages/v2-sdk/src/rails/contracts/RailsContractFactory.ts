import type { RPC } from '../types.js'
import { RailsGatewayContract } from './RailsGatewayContract.js'
import { RailsPathContract } from './RailsPathContract.js'
import {
  type Chainish,
  type Pathish,
  getChain,
  getGateway,
  getPath
} from '#models/index.js'

export function getRailsGateway(chain: Chainish, rpc?: RPC): RailsGatewayContract {
  const chainId = getChain(chain).chainId
  const address = getGateway(chainId).railsGateway
  return new RailsGatewayContract(address, rpc)
}

export function getRailsPath(path: Pathish, chain: Chainish, rpc?: RPC): RailsPathContract {
  const chainId = getChain(chain).chainId
  const pathId = getPath(path).pathId
  const gateway = getGateway(chainId)
  const pathAddress = gateway.getPathContractAddress(pathId)
  return new RailsPathContract(pathAddress, rpc)
}

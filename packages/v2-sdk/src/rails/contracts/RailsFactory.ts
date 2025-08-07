import type { Signer, providers } from 'ethers'
import { RailsGateway } from './RailsGateway.js'
import { RailsPath } from './RailsPath.js'
import {
  type Addressish,
  type Chainish,
  getAddress,
  getChain,
  getGateway,
} from '#models/index.js'

export function getRailsGateway(chainId: Chainish, provider: Signer | providers.Provider): RailsGateway {
  const address = getGateway(getChain(chainId).chainId).railsGateway
  return new RailsGateway(address, provider)
}

export function getRailsPath(address: Addressish, provider: Signer | providers.Provider): RailsPath {
  return new RailsPath(getAddress(address).toString(), provider)
}

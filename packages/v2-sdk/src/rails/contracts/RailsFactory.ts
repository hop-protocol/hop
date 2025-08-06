import type { Signer, providers } from 'ethers'
import { RailsGateway } from './RailsGateway.js'
import { RailsPath } from './RailsPath.js'
import { getGateway } from '../../utils/gateways.js'
import {
  type Addressish,
  type Chainish,
  Address,
  Chain
} from '#models/index.js'

export function getRailsGateway(chainId: Chainish, provider: Signer | providers.Provider): RailsGateway {
  const address = getGateway(Chain.getChain(chainId).chainId)
  if (!address || !address.railsGateway) {
    throw new Error(`RailsGateway address not found for chainId ${chainId}`)
  }
  return new RailsGateway(address.railsGateway, provider)
}

export function getRailsPath(address: Addressish, provider: Signer | providers.Provider): RailsPath {
  return new RailsPath(Address.getAddress(address).toString(), provider)
}

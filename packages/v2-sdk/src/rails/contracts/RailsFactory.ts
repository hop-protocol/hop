import type { Signer, providers } from 'ethers'
import { RailsGateway } from './RailsGateway.js'
import { RailsPath } from './RailsPath.js'
import { getGateway } from '../../utils/gateways.js'

export function getRailsGateway(chainId: string, provider: Signer | providers.Provider): RailsGateway {
  const address = getGateway(chainId)
  if (!address || !address.railsGateway) {
    throw new Error(`RailsGateway address not found for chainId ${chainId}`)
  }
  return RailsGateway.connect(address.railsGateway, provider)
}

export function getRailsPath(address: string, provider: Signer | providers.Provider): RailsPath {
  return RailsPath.connect(address, provider)
}

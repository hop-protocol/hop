import type { Signer, providers } from 'ethers'
import { getRailsGatewayAddress } from './utils.js'
import { RailsGateway } from './RailsGateway.js'
import { RailsPath } from './RailsPath.js'

export function getRailsGateway(chainId: string, signerOrProvider: Signer | providers.Provider): RailsGateway {
  const address = getRailsGatewayAddress(chainId)
  return RailsGateway.connect(address, signerOrProvider)
}

export function getRailsPath(address: string, signerOrProvider: Signer | providers.Provider): RailsPath {
  return RailsPath.connect(address, signerOrProvider)
}

import type { Signer, providers } from 'ethers'
import { 
  type RailsPath,
  type RailsGateway,
  RailsGateway__factory,
  RailsPath__factory
} from '#contracts/index.js'
import { getRailsGatewayAddress } from './utils.js'


export function getRailsGateway(chainId: string, signerOrProvider: Signer | providers.Provider): RailsGateway {
  const address = getRailsGatewayAddress(chainId)
  return RailsGateway__factory.connect(address, signerOrProvider)
}

export function getRailsPath(address: string, signerOrProvider: Signer | providers.Provider): RailsPath {
  return RailsPath__factory.connect(address, signerOrProvider)
}

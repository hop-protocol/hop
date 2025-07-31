import type { Signer, providers } from 'ethers'
import { 
  type RailsPath,
  type RailsGateway,
  RailsGateway__factory,
  RailsPath__factory
} from '#contracts/index.js'
import { addresses } from '#addresses/index.js'


// TODO: Update with new config
function getRailsGatewayAddress(chainId: string): string {
  const chainAddresses = addresses[chainId].addresses
  // TODO: Validate chainId
  if (!chainAddresses || !chainAddresses.railsGateway) {
    throw new Error(`RailsGateway address not found for chainId ${chainId}`)
  }
  return chainAddresses.railsGateway
}

export function getRailsGateway(chainId: string, signerOrProvider: Signer | providers.Provider): RailsGateway {
  const address = getRailsGatewayAddress(chainId)
  return RailsGateway__factory.connect(address, signerOrProvider)
}

export function getRailsPath(address: string, signerOrProvider: Signer | providers.Provider): RailsPath {
  return RailsPath__factory.connect(address, signerOrProvider)
}

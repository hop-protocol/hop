import { addresses } from '#addresses/index.js'
import {  type RailsPath } from '../types.js'

// TODO: Update with new config
export function getRailsGatewayAddress(chainId: string): string {
  const chainAddresses = addresses[chainId].addresses
  // TODO: Validate chainId
  if (!chainAddresses || !chainAddresses.railsGateway) {
    throw new Error(`RailsGateway address not found for chainId ${chainId}`)
  }
  return chainAddresses.railsGateway
}

// TODO: This should be done by the contract. Remove when it is
export function formatPathInfo(pathInfo: any): RailsPath {
  return {
    chainId: pathInfo[0].toString(),
    token: pathInfo[1],
    counterpartChainId: pathInfo[2].toString(),
    counterpartToken: pathInfo[3],
    initialReserve: pathInfo[4]
  }
}

import { gateways, type GatewayConfig } from '../../config/gateways/index.js'

/**
 * Get all gateways across all networks
 * @returns Array of all gateway configurations
 */
export function getGateways(): GatewayConfig[] {
  const allGateways: GatewayConfig[] = []
  
  for (const networkGateways of Object.values(gateways)) {
    allGateways.push(...Object.values(networkGateways))
  }
  
  return allGateways
}

/**
 * Get a specific gateway by chain ID
 * @param chainId The chain ID to look up
 * @returns Gateway configuration or undefined if not found
 */
export function getGateway(chainId: string): GatewayConfig | undefined {
  for (const networkGateways of Object.values(gateways)) {
    if (networkGateways[chainId]) {
      return networkGateways[chainId]
    }
  }
  
  return undefined
}

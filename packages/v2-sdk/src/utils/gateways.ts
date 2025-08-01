import { gateways, type GatewayConfig } from '../config/gateways/index.js'

export function getGateways(): GatewayConfig[] {
  const allGateways: GatewayConfig[] = []
  
  for (const networkGateways of Object.values(gateways)) {
    allGateways.push(...Object.values(networkGateways))
  }
  
  return allGateways
}

export function getGateway(chainId: string): GatewayConfig | undefined {
  for (const networkGateways of Object.values(gateways)) {
    if (networkGateways[chainId]) {
      return networkGateways[chainId]
    }
  }

  return undefined
}

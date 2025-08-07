import { GatewayConfig } from './types.js'
import { gateways as mainnetGateways } from './mainnet.js'
import { gateways as sepoliaGateways } from './sepolia.js'

export type { GatewayConfig }

export const gateways: Record<string, GatewayConfig> = {
  ...mainnetGateways,
  ...sepoliaGateways
}

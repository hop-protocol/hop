import type { GatewayConfig } from './types.js'
import { gateways as mainnetGateways } from './mainnet.js'
import { gateways as sepoliaGateways } from './sepolia.js'

/**
 * Types and utils
 */

export type { GatewayConfig }

/**
 * All gateway configurations merged from different networks
 */
export const gateways: Record<string, GatewayConfig> = {
  ...mainnetGateways,
  ...sepoliaGateways
}

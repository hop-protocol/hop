import { addresses as goerli } from './goerli.js'
import { addresses as mainnet } from './mainnet.js'
import { addresses as sepolia } from './sepolia.js'

const addresses = { goerli, sepolia, mainnet }

export { goerli, sepolia, mainnet, addresses }

export {
  L1BridgeProps,
  L2BridgeProps,
  PolygonBaseBridgeProps,
  PolygonBridgeProps,
  GnosisBaseBridgeProps,
  GnosisBridgeProps,
  BridgeChains,
  USDCL1BridgeBase,
  USDCL2BridgeBase,
  USDCBridge,
  Bridges,
  Routes,
  Bonders,
  RewardsContracts,
  Addresses
} from './types.js'

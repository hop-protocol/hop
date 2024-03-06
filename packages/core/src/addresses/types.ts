import { AssetSymbol, ChainSlug } from '../config/types'

export interface L1BridgeProps {
  l1CanonicalToken: string
  l1Bridge: string
  bridgeDeployedBlockNumber: number
}

export interface L2BridgeProps {
  l1CanonicalBridge: string
  l1MessengerWrapper: string
  l2CanonicalBridge: string
  l2CanonicalToken: string
  l2Bridge: string
  l2HopBridgeToken: string
  l2AmmWrapper: string
  l2SaddleSwap: string
  l2SaddleLpToken: string
  bridgeDeployedBlockNumber: number
}

export interface PolygonBaseBridgeProps {
  l1FxBaseRootTunnel: string
  l1PosRootChainManager: string
  l1PosPredicate: string
  l2MessengerProxy: string
}

export interface PolygonBridgeProps extends L2BridgeProps, PolygonBaseBridgeProps {}

export interface GnosisBaseBridgeProps {
  l1Amb: string
  l2Amb: string
}

export interface GnosisBridgeProps extends L2BridgeProps, GnosisBaseBridgeProps {}

export type BridgeChains = Partial<{
    ethereum: L1BridgeProps,
    arbitrum: L2BridgeProps,
    optimism: L2BridgeProps,
    polygon: PolygonBridgeProps,
    gnosis: GnosisBridgeProps,
    nova: L2BridgeProps
    zksync: L2BridgeProps
    linea: L2BridgeProps
    scrollzk: L2BridgeProps
    base: L2BridgeProps
    polygonzk: L2BridgeProps
  }>

type USDCL1BridgeBase = {
  cctp: string
  l1CanonicalToken: string
}

type USDCL2BridgeBase = {
  cctp: string
  l2CanonicalToken: string
}

type USDCBridge = Partial<{
  ethereum: USDCL1BridgeBase
  arbitrum: USDCL2BridgeBase
  optimism: USDCL2BridgeBase
  polygon: USDCL2BridgeBase & PolygonBaseBridgeProps
  gnosis: USDCL2BridgeBase & GnosisBaseBridgeProps
  nova: USDCL2BridgeBase,
  zksync: USDCL2BridgeBase
  linea: USDCL2BridgeBase
  scrollzk: USDCL2BridgeBase
  base: USDCL2BridgeBase
  polygonzk: USDCL2BridgeBase
}>

export type Bridges = {
  [key in AssetSymbol]: key extends 'USDC' ? USDCBridge : BridgeChains
}

export type Routes = Partial<{
  [key in ChainSlug]: Partial<{
    [key in ChainSlug]: string
  }>
}>

export type Bonders = {
  [key in AssetSymbol]: Routes
}

export type RewardsContracts = {
  [tokenSymbol: string]: {
    [chain: string]: string[]
  }
}

export type Addresses = {
  bridges: Partial<Bridges>
  bonders: Partial<Bonders>
  rewardsContracts?: RewardsContracts
}

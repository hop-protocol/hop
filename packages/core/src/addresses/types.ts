import { AssetSymbol, ChainSlug } from '../config/types'

interface L1BridgeProps {
  l1CanonicalToken: string
  l1Bridge: string
  bridgeDeployedBlockNumber: number
  proxy?: string
  validator?: string
}

interface L2BridgeProps {
  l1CanonicalBridge: string
  l1MessengerWrapper: string
  l2CanonicalBridge: string
  l2CanonicalToken: string
  l2Bridge: string
  l2HopBridgeToken: string
  l2AmmWrapper: string
  l2SaddleSwap: string
  l2SaddleLpToken: string
  proxy?: string
  validator?: string
  bridgeDeployedBlockNumber: number
}

interface PolygonBridgeProps extends L2BridgeProps {
  l1FxBaseRootTunnel: string
  l1PosRootChainManager: string
  l1PosPredicate: string
  l2MessengerProxy: string
}

interface GnosisBridgeProps extends L2BridgeProps {
  l1Amb: string
  l2Amb: string
}

export type Bridges = {
  [tokenSymbol: string]: Partial<{
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
}

export interface GnosisCanonicalAddresses {
  l1AmbAddress: string
  l2AmbAddress: string
}

export interface OptimismSuperchainCanonicalAddresses {
  batcherAddress: string
  batchInboxAddress: string
}

export interface ArbitrumSuperchainCanonicalAddresses {
  sequencerInboxAddress: string
}

export type CanonicalAddresses = {
  gnosis: GnosisCanonicalAddresses
  optimism: OptimismSuperchainCanonicalAddresses
  base: OptimismSuperchainCanonicalAddresses
  arbitrum: ArbitrumSuperchainCanonicalAddresses
  nova: ArbitrumSuperchainCanonicalAddresses
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
  canonicalAddresses?: Partial<CanonicalAddresses>
}

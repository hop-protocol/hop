export type Bridges = {
  [key: string]: Partial<{
    ethereum: {
      l1CanonicalToken: string
      l1Bridge: string
    }
    arbitrum: {
      l1CanonicalBridge: string,
      l1MessengerWrapper: string,
      l2CanonicalBridge: string,
      l2CanonicalToken: string,
      l2Bridge: string,
      l2HopBridgeToken: string,
      l2AmmWrapper: string,
      l2SaddleSwap: string,
      l2SaddleLpToken: string
      l2BridgeDeployedBlockNumber: number
    }
    optimism: {
      l1CanonicalBridge: string,
      l1MessengerWrapper: string,
      l2CanonicalBridge: string,
      l2CanonicalToken: string,
      l2Bridge: string,
      l2HopBridgeToken: string,
      l2AmmWrapper: string,
      l2SaddleSwap: string,
      l2SaddleLpToken: string
      l2BridgeDeployedBlockNumber: number
    }
    polygon: {
      l1CanonicalBridge: string,
      l1MessengerWrapper: string,
      l2CanonicalBridge: string,
      l2CanonicalToken: string,
      l2Bridge: string,
      l2HopBridgeToken: string,
      l2AmmWrapper: string,
      l2SaddleSwap: string,
      l2SaddleLpToken: string,
      l1FxBaseRootTunnel: string,
      l1PosRootChainManager: string,
      l1PosPredicate: string
      l2BridgeDeployedBlockNumber: number
    }
    xdai: {
      l1CanonicalBridge: string
      l1MessengerWrapper: string
      l2CanonicalBridge: string
      l2CanonicalToken: string
      l2Bridge: string
      l2HopBridgeToken: string
      l2AmmWrapper: string
      l2SaddleSwap: string
      l2SaddleLpToken: string
      l1Amb: string
      l2Amb: string
      canonicalBridgeMaxPerTx: number
      l2BridgeDeployedBlockNumber: number
    }
  }>
}

export type Bonders = string[]

export type Addresses = {
  bridges: Bridges
  bonders: Bonders
}

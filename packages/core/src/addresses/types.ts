export type Bridges = {
  [key: string]: Partial<{
    ethereum: {
      l1CanonicalToken: string
      l1Bridge: string
      bridgeDeployedBlockNumber: number
    }
    arbitrum: {
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
    optimism: {
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
    polygon: {
      l1CanonicalBridge: string
      l1MessengerWrapper: string
      l2CanonicalBridge: string
      l2CanonicalToken: string
      l2Bridge: string
      l2HopBridgeToken: string
      l2AmmWrapper: string
      l2SaddleSwap: string
      l2SaddleLpToken: string
      l1FxBaseRootTunnel: string
      l1PosRootChainManager: string
      l1PosPredicate: string
      bridgeDeployedBlockNumber: number
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
      bridgeDeployedBlockNumber: number
    }
  }>
}

export type Bonders = {
  [token: string]: string[]
}

export type Addresses = {
  bridges: Bridges
  bonders: Bonders
}

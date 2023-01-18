export type Bridges = {
  [tokenSymbol: string]: Partial<{
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
      l2MessengerProxy: string
      bridgeDeployedBlockNumber: number
    }
    gnosis: {
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
      bridgeDeployedBlockNumber: number
    }
    nova: {
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
  }>
}

export type Routes = {
  ethereum?: {
    optimism?: string
    arbitrum?: string
    gnosis?: string
    polygon?: string
    nova?: string
  },
  optimism?: {
    ethereum?: string
    arbitrum?: string
    gnosis?: string
    polygon?: string
    nova?: string
  },
  arbitrum?: {
    ethereum?: string
    optimism?: string
    gnosis?: string
    polygon?: string
    nova?: string
  },
  gnosis?: {
    ethereum?: string
    arbitrum?: string
    optimism?: string
    polygon?: string
    nova?: string
  },
  polygon?: {
    ethereum?: string
    arbitrum?: string
    gnosis?: string
    optimism?: string
    nova?: string
  }
  nova?: {
    ethereum?: string
    arbitrum?: string
    gnosis?: string
    optimism?: string
    polygon?: string
  }
}

export type Bonders = {
  USDC?: Routes
  USDT?: Routes
  DAI?: Routes
  MATIC?: Routes
  ETH?: Routes
  WBTC?: Routes
  HOP?: Routes
  SNX?: Routes
  sUSD?: Routes
}

export type RewardsContracts = {
  [tokenSymbol: string]: {
    [chain: string]: string[]
  }
}

export type Addresses = {
  bridges: Bridges
  bonders: Bonders
  rewardsContracts?: RewardsContracts
}

export const addresses = {
  USDC: {
    ethereum: {
      l1CanonicalToken: '',
      l1Bridge: ''
    },
    polygon: {
      l1CanonicalBridge: '',
      l2CanonicalBridge: '',
      l2CanonicalToken: '',
      l2Bridge: '',
      l2HopBridgeToken: '',
      l2AmmWrapper: '',
      l2SaddleSwap: '',
      l2SaddleLpToken: '',
      l1PosRootChainManager: '0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74',
      l1PosErc20Predicate: '0xdD6596F2029e6233DEFfaCa316e6A95217d4Dc34'
    }
  }
}

export const chains = {
  ethereum: {
    name: 'Goerli',
    chainId: '5',
    rpcUrl: 'https://goerli.rpc.hop.exchange',
    explorerUrl: 'https://goerli.etherscan.io/'
  },
  polygon: {
    name: 'Polygon',
    chainId: '80001',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    explorerUrl: 'https://explorer-mumbai.maticvigil.com/'
  }
}

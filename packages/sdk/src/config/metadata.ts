export const metadata = {
  tokens: {
    DAI: {
      symbol: 'DAI',
      name: 'DAI Stablecoin',
      decimals: 18
    },
    ARB: {
      symbol: 'ARB',
      name: 'ARB Token',
      decimals: 18
    },
    sETH: {
      symbol: 'sETH',
      name: 'Synth ETH',
      decimals: 18
    },
    sBTC: {
      symbol: 'sBTC',
      name: 'Synth BTC',
      decimals: 18
    },
    USDC: {
      symbol: 'USDC',
      name: 'USDC',
      decimals: 18 // TODO: change to 6 with new contracts
    },
    WBTC: {
      symbol: 'WBTC',
      name: 'Wrapped BTC',
      decimals: 18
    }
  },
  networks: {
    ethereum: {
      name: 'Ethereum',
      isLayer1: true
    },
    arbitrum: {
      name: 'Arbitrum',
      isLayer1: false
    },
    optimism: {
      name: 'Optimism',
      isLayer1: false
    },
    xdai: {
      name: 'xDai',
      isLayer1: false
    },
    polygon: {
      name: 'Polygon',
      isLayer1: false
    }
  }
}

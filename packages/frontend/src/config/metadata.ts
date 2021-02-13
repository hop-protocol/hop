type Metadata = {
  tokens: {
    [key: string]: {
      symbol: string
      name: string
      decimals: number
    }
  }
}

export const metadata: Metadata = {
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
    }
  }
}

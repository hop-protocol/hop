export type Bridges = {
  [key: string]: Partial<{
    ethereum: {
      [key: string]: string
    }
    arbitrum: {
      [key: string]: string
    }
    optimism: {
      [key: string]: string
    }
    polygon: {
      [key: string]: string
    }
    xdai: {
      [key: string]: string
    }
  }>
}

export type Bonders = string[]

export type Addresses = {
  bridges: Bridges
  bonders: Bonders
}

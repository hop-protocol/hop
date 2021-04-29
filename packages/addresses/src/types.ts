export type Addresses = {
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

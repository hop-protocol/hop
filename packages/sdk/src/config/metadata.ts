import * as hopMetadata from '@hop-protocol/core/metadata'

export const metadata: any = {
  tokens: {
    kovan: hopMetadata.kovan.tokens,
    goerli: hopMetadata.goerli.tokens,
    mainnet: hopMetadata.mainnet.tokens,
    staging: hopMetadata.mainnet.tokens
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
    gnosis: {
      name: 'Gnosis',
      isLayer1: false
    },
    polygon: {
      name: 'Polygon',
      isLayer1: false
    }
  }
}

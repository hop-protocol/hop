import * as hopMetadata from '@hop-protocol/core/metadata'

export const metadata: any = {
  tokens: {
    kovan: hopMetadata.kovan.tokens,
    goerli: hopMetadata.goerli.tokens,
    mainnet: hopMetadata.mainnet.tokens,
    staging: hopMetadata.mainnet.tokens,
  },
  networks: {
    ethereum: {
      name: 'Ethereum',
      isLayer1: true,
      nativeTokenSymbol: 'ETH',
      chainId: 1,
    },
    arbitrum: {
      name: 'Arbitrum',
      isLayer1: false,
      nativeTokenSymbol: 'ETH',
      chainId: 42161,
    },
    optimism: {
      name: 'Optimism',
      isLayer1: false,
      nativeTokenSymbol: 'ETH',
      chainId: 10,
    },
    gnosis: {
      name: 'Gnosis',
      isLayer1: false,
      nativeTokenSymbol: 'XDAI',
      chainId: 100,
    },
    polygon: {
      name: 'Polygon',
      isLayer1: false,
      nativeTokenSymbol: 'MATIC',
      chainId: 137,
    },
  },
}

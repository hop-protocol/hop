import * as hopMetadata from '@hop-protocol/core/metadata'

export const metadata: any = {
  tokens: {
    kovan: hopMetadata.kovan.tokens,
    goerli: hopMetadata.goerli.tokens,
    mainnet: hopMetadata.mainnet.tokens,
    staging: hopMetadata.mainnet.tokens
  },
  networks: hopMetadata.chains
}

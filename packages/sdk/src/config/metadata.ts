import * as hopMetadata from '@hop-protocol/core/metadata'

export const metadata: any = {
  tokens: {
    goerli: hopMetadata.goerli.tokens,
    mainnet: hopMetadata.mainnet.tokens
  },
  networks: hopMetadata.chains
}

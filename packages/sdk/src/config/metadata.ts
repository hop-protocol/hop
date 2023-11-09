import * as hopMetadata from '@hop-protocol/core/metadata'

export const metadata: any = {
  tokens: {},
  networks: hopMetadata.chains
}

for (const network in hopMetadata) {
  metadata.tokens[network] = (hopMetadata as any)[network].tokens
}

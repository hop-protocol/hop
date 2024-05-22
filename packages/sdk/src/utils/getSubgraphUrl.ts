import { sdkConfig } from '#config/index.js'

export function getSubgraphUrl (networkSlug: string, chainSlug: string): string {
  const url = sdkConfig[networkSlug]?.chains?.[chainSlug]?.subgraphUrl
  if (!url) {
    throw new Error(`subgraph url not found for chain ${chainSlug}`)
  }

  return url
}

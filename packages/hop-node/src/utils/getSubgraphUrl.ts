import { config as globalConfig } from '#src/config/index.js'

const getSubgraphUrl = (chain: string): string => {
  const url = globalConfig.networks?.[chain]?.subgraphUrl
  if (!url) {
    throw new Error(`subgraph url not found for chain ${chain}`)
  }

  return url
}

export default getSubgraphUrl

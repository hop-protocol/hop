import { networks, regenesisEnabled } from '../config'

export function getSubgraphUrl (chain: string) {
  console.log('tempaaa', chain)
  if (regenesisEnabled) {
    return `http://localhost:8000/subgraphs/name/hop-protocol/hop-${chain}`
  }

  console.log('tempbbb', chain)
  const url = (networks as any)[chain].subgraphUrl
  console.log('tempccc', chain, url)
  if (!url) {
    throw new Error(`subgraph url not found for chain ${chain}`)
  }

  return url
}

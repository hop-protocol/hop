import fetch from 'node-fetch'
import { Chain } from 'src/constants'

export async function getSubgraphLastBlockSynced (chain: string) {
  const url = 'https://api.thegraph.com/index-node/graphql'

  if (chain === 'gnosis') {
    chain = 'xdai'
  }
  let subgraph = 'hop'
  if (chain === Chain.Ethereum) {
    subgraph = `${subgraph}-mainnet`
  } else {
    subgraph = `${subgraph}-${chain}`
  }

  const query = {
    query:
      `{
        indexingStatusForCurrentVersion(subgraphName: "hop-protocol/${subgraph}") {
          subgraph chains {
            latestBlock { number }
          }
        }
    }`
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(query)
  })

  const json = await res.json()
  const block = Number(json.data.indexingStatusForCurrentVersion.chains[0].latestBlock.number)
  return block
}

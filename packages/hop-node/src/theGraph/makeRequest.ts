import fetch from 'node-fetch'
import { Chain } from 'src/constants'

export default async function makeRequest (
  chain: string,
  query: string,
  params: any = {}
) {
  let url = 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop'
  if (chain !== Chain.Ethereum) {
    url = `${url}-${chain}`
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      query,
      variables: params
    })
  })
  const jsonRes = await res.json()
  return jsonRes.data
}

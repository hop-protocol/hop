import fetch from 'isomorphic-fetch'
import { getGraphUrl } from '../utils/getGraphUrl'

export async function makeRequest (network: string, chain: string, query: string, variables?: any) {
  const url = getGraphUrl(network, chain)
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      query,
      variables: variables || {}
    })
  })
  const jsonRes = await res.json()
  if (jsonRes.errors) {
    throw new Error(jsonRes.errors[0].message)
  }
  return jsonRes.data
}

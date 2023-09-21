import fetch from 'node-fetch'
import getSubgraphUrl from 'src/utils/getSubgraphUrl'
import rateLimitRetry from 'src/utils/rateLimitRetry'

export default async function makeRequest (
  chain: string,
  query: string,
  params: any = {}
) {
  return await rateLimitRetry(_makeRequest)(chain, query, params)
}

async function _makeRequest (
  chain: string,
  query: string,
  params: any = {}
) {
  const url = getSubgraphUrl(chain)
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
  if (Array.isArray(jsonRes.errors) && jsonRes.errors.length) {
    console.error('query:', query)
    throw new Error(jsonRes.errors[0].message)
  }
  return jsonRes.data
}

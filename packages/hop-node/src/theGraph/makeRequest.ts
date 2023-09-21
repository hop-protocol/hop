import fetch from 'node-fetch'
import rateLimitRetry from 'src/utils/rateLimitRetry'
import { Chain } from 'src/constants'
import { config as globalConfig } from 'src/config'
import getSubgraphUrl from 'src/utils/getSubgraphUrl'

export default async function makeRequest (
  chain: string,
  query: string,
  params: any = {},
  isGoerli: boolean = false
) {
  return await rateLimitRetry(_makeRequest)(chain, query, params, isGoerli)
}

async function _makeRequest (
  chain: string,
  query: string,
  params: any = {},
  isGoerli: boolean = false
) {
  // TODO: Better way to get network
  const network = isGoerli ? 'goerli' : 'mainnet'
  const url = getSubgraphUrl(chain, network)

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
